"use client";
import { searchFriendData } from "@/actions/friendActions";
import { useFriends } from "./FriendsContext";
import FriendCard from "./FriendCard";

const FriendsSearchForm = () => {
  const { friendId, setFriendId, setFriendData, friendData } = useFriends();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!friendId) {
      alert("IDを入力してください");
      return;
    }

    const friendIdNumber = Number(friendId);
    if (isNaN(friendIdNumber)) {
      alert("数値を入力してください");
      return;
    }

    try {
      const result = await searchFriendData(friendIdNumber);
      if (result.status === "success" && result.data) {
        setFriendData(result.data);
      } else {
        setFriendData(null);
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert("友達データの検索に失敗しました");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex items-center bg-background">
        <div className="flex w-full justify-between border-b border-slate-400 px-4 py-2">
          <input
            type="text"
            value={friendId}
            onChange={(e) => setFriendId(e.target.value)}
            placeholder="IDを入力してください"
            className="flex-grow-[8] border-none bg-background outline-none"
          />
          <button type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width={20}
              height={20}
              className="flex-grow-[2]"
            >
              <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        </div>
      </form>
      {friendData && (
        <FriendCard id={Number(friendId)} friendName={friendData.friendName} status={friendData.status} image={friendData.image} isSelfRequester={friendData.isSelfRequester} />
      )}
    </>
  );
};

export default FriendsSearchForm;
