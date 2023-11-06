import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postGetUpdateAPI } from 'API/Post';
import { useRecoilState } from 'recoil';
import { postDetailsState, postDetailUser, postDetailInfo } from '../../Recoil/PostDetail';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import Topbar from 'components/Common/Topbar/Topbar';
import { loginCheck } from 'Recoil/LoginCheck';
import PostDetail from 'components/Post/PostDetail';
import ModalButton from 'components/Common/Modal/ModalButton';
import Comments from 'components/Comment/Comments';
import CommentUpload from 'components/Comment/CommentUpload';
import PostDetailSkeleton from 'assets/Skeleton/PostDetailSkeleton';
export default function PostDetailPage() {
  const { post_id } = useParams();
  const [postDetails, setPostDetails] = useRecoilState(postDetailsState);
  const [postUser, setPostUser] = useRecoilState(postDetailUser);
  const [postInfo, setPostInfo] = useRecoilState(postDetailInfo);
  const [showEditDeleteModal, setShowEditDeleteModal] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [, setLoginCheck] = useRecoilState(loginCheck);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  console.log(postDetailInfo);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await postGetUpdateAPI(post_id);
        const content = JSON.parse(response.post.content);

        setPostDetails({
          title: content.title,
          author: content.author,
          review: content.review,
          isbn: content.isbn,
          image: response.post.image,
        });

        setPostInfo({
          updatedAt: response.post.updatedAt,
          createdAt: response.post.createdAt,
          heartCount: response.post.heartCount,
          hearted: response.post.hearted,
          commentCount: response.post.commentCount,
        });

        setPostUser(response.post.author);
        setIsLoading(false);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();

    return () => {
      setPostDetails({});
    };
  }, [post_id, setPostDetails, setPostInfo, setPostUser]);

  const LogoutButton = (
    <button onClick={() => setShowEditDeleteModal(true)}>
      <HiOutlineDotsVertical />
    </button>
  );

  const handleCancel = () => {
    setShowEditDeleteModal(false);
  };

  // 로그아웃
  const navigateToLoginPage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('recoil-persist');
    setLoginCheck(false);
    navigate('/main');
  };

  const navigateToEditPage = () => {
    setPostDetails(postDetails); // 수정 페이지로 이동하기 전에 업뎃
    navigate(`/post/${post_id}/edit`);
  };

  const navigateToMainPostPage = () => {
    navigate('/post');
  };
  if (isLoading) {
    return <PostDetailSkeleton />;
  }
  return (
    <>
      <Topbar title rightButton={LogoutButton} goBack={navigateToMainPostPage} />
      <PostDetail
        authorInfo={postUser}
        postInfo={postInfo}
        postDetails={postDetails}
        postid={post_id}
        hearted={postInfo.hearted}
        heartCount={postInfo.heartCount}
        showEditDeleteModal={showEditDeleteModal}
        currentItemId={currentItemId}
        setCurrentItemId={setCurrentItemId}
      />
      <Comments postId={post_id} />
      <CommentUpload postId={post_id} />

      {showEditDeleteModal && (
        <ModalButton
          itemId={currentItemId}
          text={['설정 및 개인정보', '로그아웃']}
          onClick={[navigateToEditPage, navigateToLoginPage]}
          onCancel={handleCancel}
          padding
        />
      )}
    </>
  );
}
