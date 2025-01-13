"use client";

type Props = {
  id: number;
  status?: string;
  isSelfRequester?: boolean;
  isFriendRequester?: boolean;
  onRequest: (id: number) => void;
  onCancel: () => void;
  onAccepted: (id: number) => void;
  onRejected: (id: number) => void;
  onDelete: (id: number) => void;
};

const FriendButtons = ({
  id,
  status,
  isSelfRequester,
  isFriendRequester,
  onRequest,
  onCancel,
  onAccepted,
  onRejected,
  onDelete,
}: Props) => {
  console.log("FriendButtons props:", {
    id,
    status,
    isFriendRequester,
    isSelfRequester,
  });
  switch (status) {
    case "PENDING":
      return (
        <>
          {isFriendRequester && (
            <div className="flex items-center gap-1">
              <button
                className="rounded bg-appleBlossom px-4 py-1 text-sm text-white hover:opacity-90"
                onClick={() => onRejected(id)}
              >
                拒否
              </button>
              <button
                className="rounded bg-amazon px-4 py-1 text-sm text-white opacity-70 hover:opacity-60"
                onClick={() => {
                  onAccepted(id);
                }}
              >
                承認
              </button>
            </div>
          )}
          {/* {isSelfRequester && (
            <button
              className="rounded bg-appleBlossom px-4 py-1 text-sm text-white hover:opacity-90"
              onClick={() => onRejected(id)}
            >
              取消
            </button>
          )} */}
        </>
      );

    case "ACCEPTED":
      return (
        <div>
          <button
            className="py-1 text-sm text-white hover:opacity-90"
            onClick={() => onDelete(id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width={20}
              height={20}
              className="text-appleBlossom"
            >
              <path d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      );

    case "REJECTED":
      return null;

    default:
      return (
        <div className="flex items-center gap-1">
          <button
            className="rounded bg-appleBlossom px-4 py-1 text-sm text-white hover:opacity-90"
            onClick={onCancel}
          >
            取消
          </button>
          <button
            className="rounded bg-amazon px-4 py-1 text-sm text-white opacity-70 hover:opacity-60"
            onClick={() => onRequest(id)}
          >
            申請
          </button>
        </div>
      );
  }
};

export default FriendButtons;
