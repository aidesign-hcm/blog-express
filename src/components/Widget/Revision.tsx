import React from "react";

interface User {
  _id: string;
  name: string;
}

interface Revision {
  user: User;
  timestamp: string;
}

interface Post {
  title: string;
  user: User;
  revisions: Revision[];
  updatedAt: string;
}

const PostDetails: React.FC<{ post: Post }> = ({ post }) => {
  const lastRevision = post.revisions.length > 0 ? post.revisions[post.revisions.length - 1] : null;

  return (
    <div className="mx-auto mt-4">

      {/* Post Author */}
      <div className="mt-4 flex items-center space-x-3">
        <div>
          <p className="text-gray-700 font-medium">Đăng Bởi: {post.user.username}</p>
          <p className="text-sm text-gray-500">Thời gian: {new Date(post.createdAt).toLocaleString()}</p>
        </div>
      </div>


      {/* Revision History */}
      {post.revisions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800">Lịch sử chỉnh sửa</h3>
          <ul className="mt-2 space-y-2">
            {post.revisions.slice()
              .reverse().map((rev, index) => (
              <li key={index} className="text-gray-600 text-sm border-b pb-2 last:border-none">
                <span className="font-bold">Bởi: {rev.user.username}</span> Lúc{" "}
                {new Date(rev.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
