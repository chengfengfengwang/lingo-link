import type { FallbackProps } from "react-error-boundary";
import { useErrorBoundary } from "react-error-boundary";
import { RotateCcw } from "lucide-react";
import { forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
interface FallbackComponentProps {
  fallbackProps: FallbackProps;
  className?: string;
}
interface FallbackImperative {
  hideError: () => void;
}
export default forwardRef<FallbackImperative, FallbackComponentProps>(
  function FallbackComponent(props, ref) {
    const { t } = useTranslation();
    const { resetBoundary } = useErrorBoundary();
    const handleReset = () => resetBoundary();
    useImperativeHandle(ref, () => ({
      hideError: handleReset,
    }));
    return (
      <div
        className={`w-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-red-500 text-center py-2 ${props.className}`}
      >
        <div>Error：{t(props.fallbackProps.error)}</div>

        <button
          className="btn ml-1 btn-square btn-xs btn-ghost"
          onClick={handleReset}
        >
          <RotateCcw className="w-[16px] h-[16px]" />
        </button>
      </div>
    );
  }
);
