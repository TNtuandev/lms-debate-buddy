export function formatToVietnameseMonthYear(isoDate: string): string {
  const date = new Date(isoDate);
  const month = date.getMonth() + 1; // getMonth() trả về 0–11
  const year = date.getFullYear();
  return `Tháng ${month}/${year}`;
}

export function formatToHourUnit(seconds: number): string {
  const hours = (seconds / 3600).toFixed(1); // giữ 1 số sau dấu phẩy
  return `${hours} Giờ`;
}

export function formatDateToCustomString(isoString: string): string {
  const date = new Date(isoString);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() trả về 0–11
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0h => 12am
  const hourStr = hours.toString().padStart(2, '0');

  return `${day}/${month}/${year} ${hourStr}:${minutes} ${ampm}`;
}

export function downloadFileFromUrl(url: string, filename?: string) {
  const link = document.createElement("a");
  link.href = url;
  link.style.display = "none";

  // Nếu không có filename, tự lấy tên từ URL
  const urlParts = url.split("/");
  const defaultName = urlParts[urlParts.length - 1].split("?")[0];
  link.download = filename || decodeURIComponent(defaultName);

  // Force download instead of navigation
  link.setAttribute('target', '_self');
  link.setAttribute('rel', 'noopener');

  document.body.appendChild(link);
  link.click();
  
  // Cleanup after a short delay
  setTimeout(() => {
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
  }, 100);
}