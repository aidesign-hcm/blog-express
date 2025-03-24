"use client";
import React, { useState, useEffect, useRef } from "react";
import RenderImage from "@/components/Widget/renderImage";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "react-feather";
import Link from "next/link";

const NewsOne = ({ blogs = [] }) => {
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    lazyLoad: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };
  let sliderRef = useRef(null);
  const next = () => {
    sliderRef.slickNext();
  };
  const previous = () => {
    sliderRef.slickPrev();
  };

  return (
    <>
      <Slider
        ref={(slider) => {
          sliderRef = slider;
        }}
        {...settings}
        className="overflow-x-hidden"
      >
        {blogs.map((item, index) => {
          return (
            <div key={item._id} className="slide-item p-2">
              <div className="single-post-thumbnail col-span-2 mb-2">
                <Link href={"blog/" + item.slug}>
                  <RenderImage
                    img_url={item.featureImg.path}
                    title={item.title}
                  />
                </Link>
              </div>
              <div className="box-text">
                <Link href={"blog/" + item.slug}>
                  <h2 className="text-md font-semibold">{item.title}</h2>
                </Link>
              </div>
            </div>
          );
        })}
      </Slider>
      <div className="absolute top-4 right-4">
        <div style={{ textAlign: "center" }}>
          <button className="button" onClick={previous}>
            <ChevronLeft />
          </button>
          <button className="button" onClick={next}>
            <ChevronRight />
          </button>
        </div>
      </div>
    </>
  );
};

export default NewsOne;
