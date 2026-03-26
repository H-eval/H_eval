import React from 'react';
import styled from 'styled-components';


const Button = () => {
  return (
    <StyledWrapper>
      <button className="button">
        <div className="button-box">
          <span className="button-elem">
            <svg viewBox="0 0 46 40" xmlns="http://www.w3.org/2000/svg">
              <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z" />
            </svg>
          </span>
          
          <span className="button-elem">
            <svg viewBox="0 0 46 40">
              <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z" />
            </svg>
          </span>
           
        </div>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
   .button {
        display: flex;              /* 🔥 CHANGE */
        align-items: center;        /* center vertically */
        justify-content: center;    /* center horizontally */
        position: relative;
        width: 50px;                /* 🔥 slightly bigger */
        height: 50px;
        border-radius: 50%;         /* 🔥 FORCE CIRCLE */
        overflow: hidden;
        background-color: transparent;
        border: none;
        cursor: pointer;
        }
  .button:before,
  .button:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .button:before {
    border: 4px solid #F0EEEF;
    transition: opacity .4s cubic-bezier(.77, 0, .175, 1) 80ms, transform .5s cubic-bezier(.455, .03, .515, .955) 80ms;
  }

  .button:after {
    border: 4px solid #96daf0;
    transform: scale(1.3);
    transition: opacity .4s cubic-bezier(.165, .84, .44, 1), transform .5s cubic-bezier(.25, .46, .45, .94);
    opacity: 0;
  }

  .button:hover:before,
  .button:focus:before {
    opacity: 0;
    transform: scale(0.7);
    transition: opacity .4s cubic-bezier(.165, .84, .44, 1), transform .5s cubic-bezier(.25, .46, .45, .94);
  }

  .button:hover:after,
  .button:focus:after {
    opacity: 1;
    transform: scale(1);
    transition: opacity .4s cubic-bezier(.77, 0, .175, 1) 80ms, transform .5s cubic-bezier(.455, .03, .515, .955) 80ms;
  }

   .button-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    }

   .button-elem {
        display: flex;
        align-items: center;
        justify-content: center;
    }
        .button-elem svg {
            width: 20px;
            height: 20px;
            transform: rotate(180deg);
            }


  .button:hover .button-box,
  .button:focus .button-box {
    transition: .4s;
    transform: scale(1.1);
  }`;

export default Button;
