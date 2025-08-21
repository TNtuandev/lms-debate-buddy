import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {Rating, RoundedStar} from "@smastrom/react-rating";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (rating: number, comment: string, title?: string) => void;
  isLoading?: boolean;
}

export const myStyles = {
  itemShapes: RoundedStar,
  activeFillColor: '#ffb700',
  inactiveFillColor: '#fbf1a9',
  size: 20,
}

export const ReviewDialog: React.FC<ReviewDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    if (!comment.trim()) {
      return;
    }
    
    onSubmit(rating, comment.trim(), title.trim() || undefined);
    
    // Reset form after submit
    setComment("");
    setTitle("");
    setRating(5);
  };

  const handleClose = () => {
    // Reset form when closing
    setComment("");
    setTitle("");
    setRating(5);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[440px] lg:w-[600px]">
        <DialogHeader className="items-start">
          <DialogTitle className="text-lg">Đánh giá khóa học</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium">Đánh giá của bạn về khóa học này:</span>
            <Rating
              className="ml-2"
              style={{maxWidth: 120}}
              value={rating}
              onChange={setRating}
              itemStyles={myStyles}
            />
            <span className="text-sm text-gray-600 ml-2">({rating}/5)</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề đánh giá (tùy chọn)
            </label>
            <input
              type="text"
              className="w-full p-3 border-zinc-300 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập tiêu đề cho đánh giá của bạn"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
            <div className="text-right text-gray-400 text-xs mt-1">{title.length}/100</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung đánh giá <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full p-3 border-zinc-300 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              maxLength={300}
              placeholder="Chia sẻ trải nghiệm của bạn về khóa học này..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="text-right text-gray-400 text-xs mt-1">{comment.length}/300</div>
          </div>
        </div>

        <DialogFooter className="flex gap-2 mt-6">
          <DialogClose asChild>
            <Button 
              variant="outline" 
              className="h-9 border-zinc-300 hover:border-zinc-300 text-primary font-semibold rounded-[10px]"
              disabled={isLoading}
            >
              Hủy bỏ
            </Button>
          </DialogClose>
          <Button
            className="bg-primary font-semibold w-fit h-9 rounded-[10px] bg-[#212B36] text-white hover:bg-[#2F57EF] transition-colors duration-300 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={!comment.trim() || isLoading}
          >
            {isLoading ? "Đang gửi..." : "Đăng đánh giá"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};