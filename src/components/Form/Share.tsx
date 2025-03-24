"use client";
import {
  FacebookShareButton,
  FacebookIcon,
  PinterestShareButton,
  PinterestIcon,
  RedditShareButton,
  RedditIcon,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  TwitterIcon,
  EmailShareButton,
  EmailIcon,
} from "next-share";
import { usePathname } from "next/navigation";

const PostShare = () => {
  const pathname = usePathname();
  return (
      <div className="sticky top-12 bottom-4">
        <div className="flex flex-row md:flex-col gap-2">
          <FacebookShareButton
            url={process.env.MAIN_URL + pathname}
            quote={"Báo VnExpress - Báo tiếng Việt nhiều người xem nhất"}
            hashtag={"#Blog-Ai"}
          >
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <PinterestShareButton
            url={process.env.MAIN_URL + pathname}
            media={"Báo VnExpress - Báo tiếng Việt nhiều người xem nhất"}
          >
            <PinterestIcon size={32} round />
          </PinterestShareButton>
          <RedditShareButton
            url={process.env.MAIN_URL + pathname}
            title={"Báo VnExpress - Báo tiếng Việt nhiều người xem nhất"}
          >
            <RedditIcon size={32} round />
          </RedditShareButton>
          <TelegramShareButton
            url={process.env.MAIN_URL + pathname}
            title={"Báo VnExpress - Báo tiếng Việt nhiều người xem nhất"}
          >
            <TelegramIcon size={32} round />
          </TelegramShareButton>
          <TwitterShareButton
            url={process.env.MAIN_URL + pathname}
            title={"Báo VnExpress - Báo tiếng Việt nhiều người xem nhất"}
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <EmailShareButton
            url={process.env.MAIN_URL + pathname}
            subject={"Báo VnExpress - Báo tiếng Việt nhiều người xem nhất"}
          >
            <EmailIcon size={32} round />
          </EmailShareButton>
        </div>
      </div>
  );
};

export default PostShare;
