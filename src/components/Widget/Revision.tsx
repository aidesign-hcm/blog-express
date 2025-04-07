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
  const lastRevision =
    post.revisions.length > 0
      ? post.revisions[post.revisions.length - 1]
      : null;

  return (
    <div className="mx-auto mt-4">
      {/* Post Author */}
      <div className="mt-4 flex items-center space-x-3">
        <div>
          <p className="text-gray-700 font-medium">
            Đăng Bởi: {post.user.username}
          </p>
          <p className="text-sm text-gray-500">
            Thời gian: {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Revision History */}
      {post.revisions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Lịch sử chỉnh sửa
          </h3>
          <ul className="mt-2 space-y-4">
            {post.revisions
              .slice()
              .reverse()
              .map((rev, index) => (
                <li
                  key={index}
                  className="text-gray-600 text-sm border-b pb-2 last:border-none"
                >
                  <div>
                    <span className="font-bold">Bởi: {rev.user.username}</span>{" "}
                    lúc {new Date(rev.timestamp).toLocaleString()}
                  </div>

                  {rev.changes && Object.keys(rev.changes).length > 0 && (
                    <ul className="mt-1 ml-4 list-disc text-gray-500">
                      {Object.entries(rev.changes).map(([field, change], i) => (
                        <li key={i}>
                          <span className="font-medium text-gray-700">
                            {field}
                          </span>
                          :{" "}
                          {field === "desc" || field === "short" ? (
                            <span className="italic text-blue-600">
                              Đã thay đổi
                            </span>
                          ) : field === "featureImg" ? (
                            <>
                              <span className="line-through text-red-500">
                                {change.old?.path}
                              </span>{" "}
                              →{" "}
                              <span className="text-green-600">
                                {change.new?.path}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="line-through text-red-500">
                                {String(change.old)}
                              </span>{" "}
                              →{" "}
                              <span className="text-green-600">
                                {String(change.new)}
                              </span>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
