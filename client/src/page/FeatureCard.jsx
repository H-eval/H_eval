// src/components/FeatureCard.jsx
import React from "react";
import styled from "styled-components";

const FeatureCard = ({ title, details }) => {
  return (
    <StyledWrapper>
      <div className="card">
        {title}
        <div className="details">{details}</div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    position: relative;
    width: 220px;
    height: 320px;
    background: #5b7b6d;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    border-radius: 15px;
    cursor: pointer;
    padding: 15px;
    transition: all 0.3s ease-in-out;
    overflow: hidden;
  }

//   .details {
//     display: none;
//     position: absolute;
//     bottom: 20px;
//     font-size: 14px;
//     font-weight: normal;
//     padding: 10px;
//     color: #000;
//   }

   .details {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* center in both directions */
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: #ffffff;
  z-index: 1;
  padding: 10px;
  width: 90%;
}


  .card::before,
  .card::after {
    position: absolute;
    content: "";
    width: 20%;
    height: 20%;
    background-color: #80a595ff;
    transition: all 0.5s;
    z-index: 0;
  }

  .card::before {
    top: 0;
    right: 0;
    border-radius: 0 15px 0 100%;
  }

  .card::after {
    bottom: 0;
    left: 0;
    border-radius: 0 100% 0 15px;
  }

  .card:hover::before,
  .card:hover::after {
    width: 100%;
    height: 100%;
    border-radius: 15px;
  }

  .card:hover {
    color: white;
  }

  .card:hover .details {
    display: block;
    z-index: 1;
  }
`;

export default FeatureCard;
