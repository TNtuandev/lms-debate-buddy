export interface OrderPayment {
  createdAt: string
  updatedAt: string
  deletedAt: any
  id: string
  userId: string
  cartId: string
  totalAmountBefore: number
  totalAmountAfter: number
  totalDiscount: number
  currency: string
  notes: any
  status: string
  items: Item[]
  paymentId: string
  payment: Payment
}

export interface Item {
  createdAt: string
  updatedAt: string
  deletedAt: any
  id: string
  orderId: string
  productId: string
  regularPrice: number
  discountedPrice: number
  discountAmount: number
  quantity: number
  product: Product
}

export interface Product {
  createdAt: string
  updatedAt: string
  deletedAt: any
  id: string
  title: string
  slug: string
  shortDescription: string
  description: string
  type: string
  categoryId: string
  ownerId: string
  thumbnail: string
  label: string
  status: string
  ratingAvg: number
  ratingCnt: number
  enrollmentCnt: number
  course: Course
}

export interface Course {
  id: string
  regularPrice: number
  discountedPrice: number
  requirements: string
  learningOutcomes: string
  previewVideo: string
  previewImg: string
  difficulty: string
  maxEnrollment: number
  tags: any
  isAllowFaq: boolean
  isDripContent: boolean
  overview: any
  language: any
  certification: any
  totalCompletedLessons: number
}


export interface Payment {
  createdAt: string
  updatedAt: string
  deletedAt: any
  id: string
  userId: string
  orderId: string
  amount: number
  currency: string
  method: string
  status: 'pending' | 'completed' | 'failed'
  notes: any
  manualPayment: any
  gatewayPayment: GatewayPayment
}

export interface GatewayPayment {
  createdAt: string
  updatedAt: string
  deletedAt: any
  id: string
  paymentId: string
  gateway: string
  providerTransactionId: string
  providerEventId: string
  providerResponse: any
  providerStatus: any
  providerMessage: any
  processedAt: any
  payUrl: string
  qrCodeUrl: string
  deeplink: string
  deeplinkMiniApp: string
}
