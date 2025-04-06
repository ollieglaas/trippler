import { Skeleton } from "@/components/ui/skeleton";

function ContentSkeleton() {
  return (
    <div className="p-10 md:px-20 lg:px-32 xl:px-56">
      <Skeleton className="h-86 w-full mb-5 rounded-t-xl" />
      <div className="flex flex-row justify-between items-center">
        <Skeleton className="w-56 h-10" />
        <div className="flex flex-row gap-4">
          <Skeleton className="w-32 h-10" />
          <Skeleton className="w-32 h-10" />
          <Skeleton className="w-32 h-10" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex flex-col space-y-3">
            <Skeleton className="h-6 w-2/3 col-span-1 rounded-xl mb-5" />
            <Skeleton className="h-28 col-span-1 rounded-xl mb-9" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContentSkeleton;
