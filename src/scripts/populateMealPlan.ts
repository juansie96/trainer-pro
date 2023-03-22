import { addDoc, Timestamp } from 'firebase/firestore'
import { mealPlansRef } from '../firebase/fbRefs'

export const populateMealPlan = async (trainerId: string) => {
  const mealPlan = {
    name: '[PRUEBA] Plan nutricional para Hipertrofia - 3000KCAL',
    description:
      'Este es una prueba de un plan nutricional enfocado en ganancia de músculo. Supera las 3000 calorias y tiene una gran cantidad de proteínas y carbohidratos.',
    meals: [
      {
        name: 'Desayuno',
        foods: [
          {
            nutritionalValues: {
              kcal: {
                ratio: 2.432,
                value: 364.8,
              },
              proteins: {
                ratio: 0.06,
                value: 9,
              },
              carbs: {
                ratio: 0.44,
                value: 66,
              },
              fats: {
                value: 6,
                ratio: 0.04,
              },
              fiber: {
                ratio: 0.02,
                value: 3,
              },
            },
            creatorId: '',
            name: 'Pan lactal',
            id: '07cfbba4-a305-4b8c-90d4-dacf9296ae3d',
            grams: 150,
          },
          {
            creatorId: '',
            name: 'Huevo de gallina',
            nutritionalValues: {
              carbs: {
                value: 0,
                ratio: 0,
              },
              kcal: {
                value: 150,
                ratio: 1.5,
              },
              fats: {
                ratio: 0.111,
                value: 11.1,
              },
              fiber: {
                value: 0,
                ratio: 0,
              },
              proteins: {
                ratio: 0.125,
                value: 12.5,
              },
            },
            id: 'SSGW82YcklDf8vgH0DE6',
            grams: 100,
          },
          {
            name: 'Frutos secos',
            creatorId: '',
            nutritionalValues: {
              kcal: {
                value: 282.5,
                ratio: 5.65,
              },
              proteins: {
                ratio: 0.013000000000000001,
                value: 0.65,
              },
              carbs: {
                value: 12.5,
                ratio: 0.25,
              },
              fats: {
                ratio: 0.514,
                value: 25.7,
              },
              fiber: {
                ratio: 0.09,
                value: 4.5,
              },
            },
            id: '90e0af11-17df-40d2-8d96-effd454c7ae3',
            grams: 50,
          },
        ],
      },
      {
        name: 'Media mañana',
        foods: [
          {
            name: 'Atún al natural',
            nutritionalValues: {
              kcal: {
                ratio: 1.01,
                value: 202,
              },
              proteins: {
                value: 47,
                ratio: 0.235,
              },
              carbs: {
                value: 0,
                ratio: 0,
              },
              fats: {
                value: 1.2,
                ratio: 0.006,
              },
              fiber: {
                ratio: 0,
                value: 0,
              },
            },
            creatorId: '',
            id: 'fdc66183-51c9-4f5f-b30d-780fedcde805',
            grams: 200,
          },
          {
            creatorId: '',
            nutritionalValues: {
              kcal: {
                value: 19.18,
                ratio: 0.3835,
              },
              proteins: {
                value: 0.4,
                ratio: 0.008,
              },
              carbs: {
                value: 4.3,
                ratio: 0.086,
              },
              fats: {
                ratio: 0,
                value: 0,
              },
              fiber: {
                ratio: 0.02,
                value: 1,
              },
            },
            name: 'Naranja',
            id: '0b2d6690-5e0b-459e-b493-5ddd604c3479',
            grams: 50,
          },
        ],
      },
      {
        name: 'Almuerzo',
        foods: [
          {
            nutritionalValues: {
              kcal: {
                value: 224,
                ratio: 1.12,
              },
              proteins: {
                ratio: 0.218,
                value: 43.6,
              },
              carbs: {
                ratio: 0,
                value: 0,
              },
              fats: {
                ratio: 0.027999999999999997,
                value: 5.6,
              },
              fiber: {
                value: 0,
                ratio: 0,
              },
            },
            name: 'Pechuga de pollo',
            creatorId: '',
            id: '16056014-5948-43f4-96b1-a8b1f0d75d2c',
            grams: 200,
          },
          {
            name: 'Arroz',
            nutritionalValues: {
              kcal: {
                ratio: 3.87,
                value: 696.6,
              },
              proteins: {
                ratio: 0.07,
                value: 12.6,
              },
              carbs: {
                ratio: 0.86,
                value: 154.8,
              },
              fats: {
                ratio: 0.01,
                value: 1.8,
              },
              fiber: {
                value: 0.36,
                ratio: 0.002,
              },
            },
            creatorId: '',
            id: 'aca6b4db-1fc5-4776-8ee0-75e6aaec5079',
            grams: 180,
          },
          {
            nutritionalValues: {
              fiber: {
                ratio: 0,
                value: 0,
              },
              carbs: {
                value: 0,
                ratio: 0,
              },
              kcal: {
                value: 38,
                ratio: 0.38,
              },
              proteins: {
                value: 0,
                ratio: 0,
              },
              fats: {
                value: 0,
                ratio: 0,
              },
            },
            name: 'Brocoli crudo',
            creatorId: '',
            id: 'WjfpgwjU1pPVs6iKFKm1',
            grams: 100,
          },
        ],
      },
      {
        name: 'Merienda',
        foods: [
          {
            creatorId: '',
            nutritionalValues: {
              fiber: {
                value: 0,
                ratio: 0,
              },
              fats: {
                ratio: 0.2,
                value: 20,
              },
              kcal: {
                ratio: 3.04,
                value: 304,
              },
              proteins: {
                ratio: 0.24,
                value: 24,
              },
              carbs: {
                ratio: 0.019,
                value: 1.9,
              },
            },
            name: 'Queso cremoso',
            id: 'bj9jjmrq1ZJCwL1LARp4',
            grams: 100,
          },
          {
            nutritionalValues: {
              proteins: {
                ratio: 0.06,
                value: 6,
              },
              carbs: {
                ratio: 0.44,
                value: 44,
              },
              fiber: {
                value: 2,
                ratio: 0.02,
              },
              kcal: {
                ratio: 2.432,
                value: 243.2,
              },
              fats: {
                value: 4,
                ratio: 0.04,
              },
            },
            name: 'Pan lactal',
            creatorId: '',
            id: 'nlWslLRfDcGzRzk5W1o0',
            grams: 100,
          },
        ],
      },
      {
        name: 'Cena',
        foods: [
          {
            name: 'Pechuga de pollo',
            creatorId: '',
            nutritionalValues: {
              kcal: {
                value: 224,
                ratio: 1.12,
              },
              proteins: {
                value: 43.6,
                ratio: 0.218,
              },
              carbs: {
                ratio: 0,
                value: 0,
              },
              fats: {
                ratio: 0.027999999999999997,
                value: 5.6,
              },
              fiber: {
                value: 0,
                ratio: 0,
              },
            },
            id: '98ffbcf7-8a3e-40a4-b600-28577e8176fd',
            grams: 200,
          },
          {
            creatorId: '',
            nutritionalValues: {
              fats: {
                ratio: 0.002,
                value: 0.2,
              },
              fiber: {
                value: 1,
                ratio: 0.01,
              },
              kcal: {
                value: 17.28,
                ratio: 0.1728,
              },
              proteins: {
                value: 1.28,
                ratio: 0.0128,
              },
              carbs: {
                value: 2,
                ratio: 0.02,
              },
            },
            name: 'Calabacín',
            id: 'etxwJdjBwBV9ZLQ8ocHG',
            grams: 100,
          },
          {
            nutritionalValues: {
              kcal: {
                ratio: 1.01,
                value: 303,
              },
              proteins: {
                ratio: 0.012,
                value: 3.6,
              },
              carbs: {
                value: 64.5,
                ratio: 0.215,
              },
              fats: {
                ratio: 0.006,
                value: 1.8,
              },
              fiber: {
                value: 7.5,
                ratio: 0.025,
              },
            },
            name: 'Batata cruda',
            creatorId: '',
            id: 'a6ecd4d6-8ac9-4959-944d-d97556205000',
            grams: 300,
          },
        ],
      },
    ],
    kcal: 3068.56,
    createdAt: Timestamp.fromDate(new Date()),
    clientId: '',
    trainerId,
  }

  await addDoc(mealPlansRef, mealPlan)
}
