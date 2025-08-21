import React from "react";
import { ArrowRight2 } from "iconsax-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/slices/auth.slice";

interface Module {
  title: string;
  id: string;
  lessons?: {
    id: string;
  }[];
}

interface CourseContentProps {
  moduleData?: {
    data?: Module[];
  };
  slug?: string;
}

export const CourseContent: React.FC<CourseContentProps> = ({ moduleData, slug }) => {
  const router = useRouter();
  const user = useAuthStore.getState().user

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-100 mb-8">
      <h3 className="text-xl font-bold mb-6">Nội dung khóa học</h3>
      <div className="space-y-2">
        {moduleData?.data && moduleData.data?.length > 0 ? (
          moduleData.data.map((item) => (
            <div
              role="presentation"
              className="p-4 rounded-lg bg-gray-50 cursor-pointer"
              key={item.id}
              onClick={() => {
                if (user) {
                  router.push(
                    `/lesson?course=${slug}&module=${item.id}&lesson=${item?.lessons?.[0]?.id}`,
                  );
                } else {
                  router.push('/login')
                }
              }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{item.title}</h4>
                  <div className="bg-[#919EAB29] p-1 rounded">
                    <span className="text-sm text-gray-500 font-semibold">
                      1 giờ 12 phút
                    </span>
                  </div>
                </div>
                <ArrowRight2 size="24" color="black" />
              </div>
            </div>
          ))
        ) : (
          <div>Hiện chưa có bài học nào!</div>
        )}
      </div>
    </div>
  );
}; 