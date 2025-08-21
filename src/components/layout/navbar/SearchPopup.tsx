import React, { useState } from "react";
import { SearchNormal1 } from "iconsax-react";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import _ from "lodash";

interface ISearchProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function SearchPopup({ open, setOpen }: ISearchProps) {
  const [valueSearch, setValueSearch] = useState("");

  const debounceSearch = _.debounce((value: string) => {
    console.log("valueSearch--", valueSearch)
    setValueSearch(value);
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debounceSearch(e.target.value);
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent showCloseButton={false} className="w-[440px]">
        <div className="flex items-center gap-2">
          <SearchNormal1 size="24" color="#9F9FA9" />
          <Input
            className="border-0 shadow-none"
            onChange={handleSearchChange}
            placeholder="Nhập..."
          />
          <DialogClose className="text-[13px] text-text-primary right-4 px-2 py-1 rounded-lg bg-zinc-100">
            ESC
          </DialogClose>
        </div>
        <div className="max-h-[70vh] lg:max-h-[50vh] overflow-y-auto mt-4"></div>
        {/*<ForgotPasswordForm submit={(email) => handleOpenOtp(email)}/>*/}
      </DialogContent>
    </Dialog>
  );
}

export default SearchPopup;
