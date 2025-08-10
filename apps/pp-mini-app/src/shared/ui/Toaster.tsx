import { toast, ToastContainer as ToastContainerSrc } from 'react-toastify';

export const ToastContainer = ToastContainerSrc;

interface MsgData {
  text: string;
  title?: string;
}

interface MsgProps {
  data: MsgData;
}

export const Msg = ({ data }: MsgProps) => {
  return (
    <div className="flex flex-col text-sm">
      {data.title ? <span className="font-bold">{data.title}</span> : <></>}
      <span>{data.text}</span>
    </div>
  );
};

type ToastProps = MsgData;

export const ToastSuccess = ({ text, title }: ToastProps) =>
  toast.success(Msg, {
    data: {
      text,
      title
    }
  });
export const ToastWarning = ({ text, title }: ToastProps) =>
  toast.warning(Msg, {
    data: {
      text,
      title
    }
  });
export const ToastError = ({ text, title }: ToastProps) =>
  toast.error(Msg, {
    data: {
      text,
      title
    }
  });
