"use client";

import {
  Drawer,
  DrawerContent,
  DrawerFooter, DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ArrowLeft2, ArrowRight2, HambergerMenu } from "iconsax-react";
import React, {useState} from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Routes } from "@/lib/routes/routes";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthProvider";

export const MenuMobile = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, signOut } = useAuthContext();
  const [isExploreOpen, setIsExploreOpen] = React.useState(false);
  const [open, setOpen] = useState(false);

  const handleNavigateToHome = () => {
    router.push(Routes.home);
  };

  const handleRoute = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  const listExplore = [
    {
      label: "Code.org",
      // href: Routes.home,
      onClick: () => {
        // handleRoute(Routes.home);
      },
    },
    {
      label: "Scratch",
      // href: Routes.course,
      onClick: () => {
        // handleRoute(Routes.course);
      },
    },
    {
      label: "Thiết kế web-app",
      // href: Routes.teacher,
      onClick: () => {
        // handleRoute(Routes.teacher);
      },
    },
    {
      label: "Python",
      // href: Routes.news,
      onClick: () => {
        // handleRoute(Routes.news);
      },
    },
    {
      label: "Minecraft",
    },
    {
      label: "Lập trình Robotics",
    },
    {
      label: "Trí tuệ nhân tạo",
    },
  ];

  const listMenu = [
    {
      label: "Thông báo",
      href: Routes.notification,
      onClick: () => {
        handleRoute(Routes.notification);
      },
    },
    {
      label: "Khám phá",
      // href: Routes.home,
      onClick: () => {
        setIsExploreOpen(true);
      },
    },
    {
      label: "Tổng quan",
      href: Routes.home,
      onClick: () => {
        handleRoute(Routes.home);
      },
    },
    {
      label: "Hồ sơ",
      href: Routes.profile,
      onClick: () => {
        handleRoute(Routes.profile);
      },
    },
    {
      label: "Khoá học đã đăng ký",
      href: Routes.courseRegister,
      onClick: () => {
        handleRoute(Routes.courseRegister);
      },
    },
    {
      label: "Yêu thích",
      href: Routes.favorite,
      onClick: () => {
        handleRoute(Routes.favorite);
      },
    },
    {
      label: "Đánh giá",
      href: Routes.rating,
      onClick: () => {
        handleRoute(Routes.rating);
      },
    },
    {
      label: "Kiểm tra",
      href: Routes.audit,
      onClick: () => {
        handleRoute(Routes.audit);
      },
    },
    {
      label: "Lịch sử mua hàng",
      href: Routes.historyPurchases,
      onClick: () => {
        handleRoute(Routes.historyPurchases);
      },
    },
    {
      label: "Cài đặt",
      // href: Routes.course,
      onClick: () => {
        // handleRoute(Routes.course);
      },
    },
  ];

  const navigateToProfile = () => {
    router.push(Routes.dashboard);
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>
        <HambergerMenu
          className="block lg:hidden"
          variant="Broken"
          size={24}
          color="#637381"
        />
      </DrawerTrigger>
      <DrawerContent  className="w-[300px] bg-white justify-between">
        <DrawerTitle className="sr-only">
          menu
        </DrawerTitle>
        <div className="cursor-pointer p-4 w-full">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={171}
            height={40}
            onClick={handleNavigateToHome}
          />
        </div>
        {isExploreOpen ? (
          <div className="flex-1 overflow-scroll">
            <Button
              onClick={() => setIsExploreOpen(false)}
              className="bg-[#919EAB]/8 h-[60px] px-10 gap-3 w-full justify-start rounded-[10px]"
            >
              <ArrowLeft2 size="14" color="#637381" />
              <span className="font-semibold text-sm">Menu</span>
            </Button>
            <div className="mt-6 flex flex-col gap-2">
              <Button
                className={clsx(
                  "bg-transparent px-3 h-11 w-full justify-start rounded-[10px] shadow-none text-sm font-medium text-secondary",
                )}
              >
                Khám phá
              </Button>
              {listExplore.map((item, index) => (
                <Button
                  key={index}
                  className={clsx(
                    "bg-transparent px-3 h-11 w-full justify-start rounded-[10px] shadow-none text-sm font-medium text-secondary",
                  )}
                  onClick={item.onClick}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-scroll">
            {isAuthenticated && (
              <Button
                onClick={navigateToProfile}
                className="bg-[#919EAB]/8 h-[60px] px-2.5 gap-3 w-full justify-between items-center rounded-[10px]">
                <Image
                  src={"/images/banner-sign-in.png"} // Đường dẫn đến avatar
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="cursor-pointer rounded-full h-[40px] w-[40px]"
                />
                <div className="flex flex-col flex-1 items-start">
                  <span className="leading-[22px] text-primary-contrastText font-semibold text-sm">
                    Chris Hemsworth
                  </span>
                  <span className="text-secondary text-xs leading-[18px]">
                    demo@americanstudy.cc
                  </span>
                </div>
                <div>
                  <ArrowRight2 size="14" color="#637381" />
                </div>
              </Button>
            )}
            <div className="mt-6 flex flex-col gap-2">
              {listMenu.map((item, index) => (
                <Button
                  key={index}
                  className={clsx(
                    "bg-transparent px-3 h-11 w-full justify-start rounded-[10px] shadow-none text-sm font-medium text-secondary",
                    pathname === item.href &&
                      "text-primary-main bg-primary-main/8",
                  )}
                  onClick={item.onClick}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        )}
        {isAuthenticated ? (
          <Button
            onClick={signOut}
            variant="default"
            className="bg-error-main/16 mb-6 h-10  shadow-md hover:shadow-xl hover:shadow-primary-main/20 transition-shadow duration-300 text-error-main px-4 py-1.5 rounded-[10px]"
          >
            Đăng xuất
          </Button>
        ) : (
          <DrawerFooter className="mb-6">
            <Button variant="ghost" className="h-10">
              <Link href={Routes.login}>Đăng nhập</Link>
            </Button>
            <Button
              variant="default"
              className="bg-[#FFA10A] h-10  shadow-md hover:shadow-xl hover:shadow-primary-main/20 transition-shadow duration-300 text-white px-4 py-1.5 rounded-[10px]"
            >
              <Link href={Routes.register}>Đăng ký</Link>
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};