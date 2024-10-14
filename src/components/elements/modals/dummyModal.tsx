interface ConfirmModalProps {
  confirmModalPopUp: boolean;
}

export default function DummyModal({ confirmModalPopUp }: ConfirmModalProps) {
  if (!confirmModalPopUp) return null;

  return (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center"></div>
  );
}
