import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Profile from './Profile'
import AddCompany from './AddCompany'
import { useSelector } from 'react-redux';
import { RootReducer } from '@/redux/store/reducer';

const ProfileHandler = () => {
  const { role } = useSelector((state: RootReducer) => state.authReducer)

  if (role == 'user') {
    return (
      <Profile />
    )
  }
  return <AddCompany />
}

export default ProfileHandler

const styles = StyleSheet.create({})