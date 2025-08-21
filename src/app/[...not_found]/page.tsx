"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Routes } from '@/lib/routes/routes';

export default function Custom404() {
  const router = useRouter();
  const handleGoBack = () => {
    router.push(Routes.home)
  }
  return (
    <div className="py-2 px-10 flex-1 flex flex-col">
      <Image className="cursor-pointer" onClick={handleGoBack} src="/images/logo.png" alt="Logo" width={182} height={48} />
      <div className="flex flex-col items-center justify-center gap-16 flex-1">
        <div className="">
          <div className="text-6xl font-bold text-center">Oops!</div>
          <div className="text-secondary pt-4">Chúng tôi không tìm thấy trang bạn đang tìm kiếm.</div>
        </div>
        <Image src="/images/404.png" alt="404" width={400} height={400} />
        <Button onClick={handleGoBack} className="">
          <ArrowLeft size={20} color="white" />
          <span className="text-sm font-semibold text-white">Về trang chủ</span>
        </Button>
      </div>
    </div>
  )
}