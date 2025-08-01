// app/loading.tsx
// loading spinner component
const Loading = () => {
  return (
    <div className="h-[calc(98vh-74px)] overflow-auto flex items-center justify-center">
      <div
        className="inline-block h-10 w-10 animate-spin rounded-full border-5 border-solid border-current border-e-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.8s_linear_infinite] dark:text-white"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>
  );
};

export default Loading;
