import {
  closeLoginModal,
  closeRegisterModal,
  openLoginModal,
  openRegisterModal,
  openEmailLoginModal,
  closeEmailLoginModal,
} from "@/store/modal/authModalSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useAuthModal = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isEmailLoginModalOpen, setIsEmailLoginModalOpen] = useState(false);

  const dispatch = useDispatch();

  const openLogin = () => {
    setIsLoginModalOpen(true);
    dispatch(openLoginModal());
  };
  const closeLogin = () => {
    setIsLoginModalOpen(false);
    dispatch(closeLoginModal());
  };

  const openRegister = () => {
    setIsRegisterModalOpen(true);
    dispatch(openRegisterModal());
  };
  const closeRegister = () => {
    setIsRegisterModalOpen(false);
    dispatch(closeRegisterModal());
  };

  const openEmailLogin = () => {
    setIsEmailLoginModalOpen(true);
    dispatch(openEmailLoginModal());
  };

  const closeEmailLogin = () => {
    setIsEmailLoginModalOpen(false);
    dispatch(closeEmailLoginModal());
  };

  return {
    isLoginModalOpen,
    isRegisterModalOpen,
    openLogin,
    closeLogin,
    openRegister,
    closeRegister,
    openEmailLogin,
    closeEmailLogin,
  };
};

export default useAuthModal;