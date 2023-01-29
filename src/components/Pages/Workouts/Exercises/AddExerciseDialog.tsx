import React, { ChangeEvent, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material'
import FormContainer from '../../../Form/FormContainer'
import { useForm } from 'react-hook-form'
import { addDoc, WithFieldValue } from 'firebase/firestore'
import { exercisesRef } from '../../../../firebase/fbRefs'
import { Box } from '@mui/system'
import TextFieldElement from '../../../Form/TextFieldElement'
import { extractVideoID, videoUrlIsValid } from '../../../../utils'
import { TagsInput } from '../../../Form/TagsInput'
import { storage } from '../../../../firebase/firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Swal from 'sweetalert2'
import { Exercise } from '../../../../types/workout'

interface AddExerciseDialogProps {
  open: boolean
  onClose(): void
}

export interface AddExerciseFormData {
  name: string
  description: string
  videoUrl?: string
  tags: string[] | null
}

type MediaType = 'video' | 'image' | 'none'

interface Image {
  file: File
  objectURL: string
}

const AddExerciseDialog = ({ open, onClose }: AddExerciseDialogProps) => {
  const formContext = useForm<AddExerciseFormData>()

  const [isAdding, setIsAdding] = useState<boolean>(false)
  const [mediaType, setMediaType] = useState<MediaType>('video')
  const [firstImage, setFirstImage] = useState<Image>()
  const [secondImage, setSecondImage] = useState<Image>()
  const [thirdImage, setThirdImage] = useState<Image>()

  let selectMediaTypeContent

  const videoUrl = formContext.watch('videoUrl')
  let videoContainerContent

  if (videoUrl) {
    if (videoUrlIsValid(videoUrl)) {
      videoContainerContent = (
        <iframe
          style={{ marginTop: '16px' }}
          width='560'
          height='315'
          src={`https://www.youtube.com/embed/${extractVideoID(videoUrl)}`}
          title='YouTube video player'
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen={true}
        ></iframe>
      )
    } else {
      videoContainerContent = <VideoErrorContainer message='¡Ups! La URL ingresada no es válida' />
    }
  } else {
    videoContainerContent = <VideoErrorContainer message='Añade una URL de Youtube válida' />
  }

  const uploadImages = async (): Promise<string[]> => {
    const uploadImgsPromises = []
    if (firstImage) uploadImgsPromises.push(uploadImageToCloudStorage(firstImage.file))
    if (secondImage) uploadImgsPromises.push(uploadImageToCloudStorage(secondImage.file))
    if (thirdImage) uploadImgsPromises.push(uploadImageToCloudStorage(thirdImage.file))
    return await Promise.all(uploadImgsPromises)
  }

  const onSubmit = async (exercise: AddExerciseFormData) => {
    const newExercise: AddExerciseFormData & { imgUrls?: string[] | null } = {
      ...exercise,
    }

    setIsAdding(true)

    if (mediaType === 'image') {
      newExercise.videoUrl = ''
      const imgUrls = await uploadImages()
      newExercise.imgUrls = imgUrls
    } else if (mediaType === 'video') {
      newExercise.imgUrls = null
    } else {
      newExercise.videoUrl = ''
      newExercise.imgUrls = null
    }

    try {
      const res = await addDoc(exercisesRef, newExercise as WithFieldValue<Exercise>)
      setIsAdding(false)
      onClose()
      Swal.fire('¡Éxito!', 'El ejercicio se creo correctamente!', 'success')
    } catch (error) {
      console.error(error)
      setIsAdding(false)
    }
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMediaType(e.target.value as MediaType)
  }

  const onImageChange = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    if (!e.target.files) {
      return
    }
    switch (id) {
      case 'first':
        setFirstImage({
          file: e.target.files[0],
          objectURL: URL.createObjectURL(e.target.files[0]),
        })
        return
      case 'second':
        setSecondImage({
          file: e.target.files[0],
          objectURL: URL.createObjectURL(e.target.files[0]),
        })
        return
      case 'third':
        setThirdImage({
          file: e.target.files[0],
          objectURL: URL.createObjectURL(e.target.files[0]),
        })
        return
      default:
        return
    }
  }

  if (mediaType === 'video') {
    selectMediaTypeContent = (
      <Box mt={2} display='flex' flexDirection='column' alignItems='center' width={1}>
        <TextFieldElement
          name='videoUrl'
          label='URL del video'
          validation={{
            required: 'La URL del video es requerida',
            pattern: {
              value: validVideoURLRegex,
              message: 'Debe introducir una URL de Youtube válida',
            },
          }}
          size='small'
          fullWidth={true}
        />
        <Box mt={2}>{videoContainerContent}</Box>
      </Box>
    )
  } else if (mediaType === 'image') {
    selectMediaTypeContent = (
      <Box
        className='exerciseImgsContainer'
        width={1}
        display='flex'
        justifyContent='space-around'
        mt={2}
      >
        <Box display='flex' flexDirection='column' alignItems='center'>
          {firstImage ? (
            <img
              alt='exercise'
              src={firstImage.objectURL}
              style={{ maxWidth: 200, maxHeight: 200 }}
            />
          ) : (
            <ExerciseSvgPlaceholder />
          )}

          <Button sx={{ mt: 1 }} variant='outlined' component='label'>
            Elegir foto 1
            <input
              name='imgUrl1'
              type='file'
              hidden
              accept='image/*'
              onChange={(e) => onImageChange(e, 'first')}
            />
          </Button>
        </Box>
        <Box display='flex' flexDirection='column' alignItems='center'>
          {secondImage ? (
            <img
              alt='exercise'
              src={secondImage.objectURL}
              style={{ maxWidth: 200, maxHeight: 200 }}
            />
          ) : (
            <ExerciseSvgPlaceholder />
          )}
          <Button sx={{ mt: 1 }} variant='outlined' component='label'>
            Elegir foto 2
            <input name='imgUrl2' type='file' hidden onChange={(e) => onImageChange(e, 'second')} />
          </Button>
        </Box>
        <Box display='flex' flexDirection='column' alignItems='center'>
          {thirdImage ? (
            <img
              alt='exercise'
              src={thirdImage.objectURL}
              style={{ maxWidth: 200, maxHeight: 200 }}
            />
          ) : (
            <ExerciseSvgPlaceholder />
          )}
          <Button sx={{ mt: 1 }} variant='outlined' component='label'>
            Elegir foto 3
            <input name='imgUrl3' type='file' hidden onChange={(e) => onImageChange(e, 'third')} />
          </Button>
        </Box>
      </Box>
    )
  } else if (mediaType === 'none') {
    selectMediaTypeContent = <></>
  }

  return (
    <div>
      <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
        <FormContainer
          formContext={formContext}
          handleSubmit={formContext.handleSubmit(onSubmit)}
          FormProps={{
            style: { height: '100%', display: 'flex', flexDirection: 'column' },
          }}
        >
          <Box borderBottom='1px solid #e3e3e3'>
            <DialogTitle>Crear Ejercicio</DialogTitle>
          </Box>
          <DialogContent sx={{ pt: 3, pb: 4 }}>
            <DialogContentText>Completa los datos de tu nuevo ejercicio</DialogContentText>

            <Stack
              width={1}
              direction='row'
              justifyContent='space-between'
              flexWrap='wrap'
              mt={2}
              sx={{ width: 1 }}
            >
              <TextFieldElement
                name='name'
                label='Nombre'
                validation={{ required: 'El nombre es requerido' }}
                size='small'
                fullWidth={true}
              />
              <FormControl sx={{ mt: 2 }}>
                <FormLabel id='demo-controlled-radio-buttons-group'>
                  ¿Quieres añadir contenido gráfico?
                </FormLabel>
                <RadioGroup value={mediaType} onChange={onChange}>
                  <FormControlLabel value='video' control={<Radio />} label='Video de Youtube' />
                  <FormControlLabel value='image' control={<Radio />} label='Imagen' />
                  <FormControlLabel value='none' control={<Radio />} label='Sin video ni imagen' />
                </RadioGroup>
              </FormControl>
              {selectMediaTypeContent}
              <TextFieldElement
                name='description'
                multiline
                rows={3}
                label='Instrucciones (opcional)'
                sx={{ mt: 2 }}
                fullWidth
              />
              <TagsInput
                name='tags'
                label='Categorías'
                placeholder='Agrega una categoría presionando enter'
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e3e3e3' }}>
            <Button onClick={onClose}>Cancelar</Button>
            <Button type='submit' variant='contained' disabled={isAdding}>
              {isAdding ? 'Creando Ejercicio' : 'Crear Ejercicio'}
            </Button>
          </DialogActions>
        </FormContainer>
      </Dialog>
    </div>
  )
}

const VideoErrorContainer = ({ message }: { message: string }) => (
  <Box
    width={560}
    height={315}
    bgcolor='#acacac'
    display='flex'
    justifyContent='center'
    alignItems='center'
    borderRadius={5}
  >
    <Typography variant='h5' color='#fff'>
      {message}
    </Typography>
  </Box>
)

const validVideoURLRegex =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/

const ExerciseSvgPlaceholder = (props: any) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 511.998 511.998'
    style={{
      enableBackground: 'new 0 0 511.998 511.998',
      width: '130px',
    }}
    xmlSpace='preserve'
    {...props}
  >
    <circle cx={264.358} cy={55.54} r={42.502} />
    <path d='M418.946 203.093c-9.346-5.34-21.253-2.092-26.593 7.255-3.145 5.504-3.291 11.889-.987 17.305l-3.069 5.372-29.226-30.973-24.156-74.089c-2.414-7.404-8.961-12.298-16.251-12.975v-.267h-94.239c-.222-.096-.431-.208-.659-.297L166.9 92.138l-4.832-55.134 10.35.042c3.541 4.701 9.143 7.764 15.484 7.791 10.765.043 19.527-8.647 19.57-19.411.043-10.765-8.647-19.527-19.412-19.57-6.339-.026-11.968 2.992-15.546 7.664l-12.904-.052C157.086 5.054 148.933-.717 139.836.072c-7.886.692-14.208 6.129-16.418 13.25l-5.138-.021c-3.541-4.701-9.143-7.765-15.484-7.791-10.763-.045-19.526 8.646-19.57 19.41-.044 10.765 8.647 19.527 19.412 19.57 6.339.025 11.968-2.992 15.546-7.664l5.879.023 6.159 70.278a18.922 18.922 0 0 0 11.947 15.966l67.787 26.565c.032.013.065.021.099.033v132.598l-46.906 199.465c-3.11 13.228 5.091 26.474 18.319 29.585 13.235 3.11 26.475-5.095 29.585-18.319l47.575-202.305h11.464l47.575 202.305c3.11 13.226 16.352 21.429 29.585 18.319 13.229-3.111 21.43-16.357 18.319-29.585L318.664 282.29v-82.082l5.74 17.608a18.912 18.912 0 0 0 4.228 7.121l40.04 42.435-4.21 7.369c-5.836.765-11.261 4.133-14.406 9.638-5.34 9.346-2.092 21.253 7.255 26.593 9.346 5.34 21.253 2.092 26.593-7.255 3.145-5.504 3.291-11.889.987-17.305l2.415-4.227c6.139 1.285 12.386-.51 16.88-4.749 7.523-7.1 7.929-18.9.98-26.51l6.629-11.603c5.836-.765 11.261-4.134 14.406-9.638 5.34-9.346 2.091-21.251-7.255-26.592z' />
  </svg>
)

const uploadImageToCloudStorage = async (file: File): Promise<string> => {
  const storageRef = ref(storage, `images/${file.name}`)
  const response = await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(response.ref)
  return downloadURL
}

export default AddExerciseDialog
