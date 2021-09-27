import React, { useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { UserContext } from '../../contexts/UserContext';

import {
  Container,
  InputArea,
  CustomButton,
  CustomButtonText,
  SignMessageButton,
  SignMessageButtonText,
  SignMessageButtonTextBold
} from './styles';

import Api from '../../Api';

import SignInput from '../../components/SignInput';

import BarberLogo from '../../assets/barber.svg';
import EmailIcon from '../../assets/email.svg';
import LockIcon from '../../assets/lock.svg';

export default () => {
  const { dispatch: userDispatch } = useContext(UserContext);
  const navigation = useNavigation();

  const [emailField, setEmailField] = useState('');
  const [passwordField, setPasswordField] = useState('');

  const handleSignClick = async () => {
    if (emailField != '' && passwordField != '') {
      
      let res = await Api.signIn(emailField, passwordField);
      if (res.token) {
        await AsyncStorage.setItem('token', res.token);

        userDispatch({
          type: 'setAvatar',
          payload: {
            avatar: res.data.avatar
          }
        });

        navigation.reset({
          routes: [{name: 'MainTab'}]
        });
      } else {
        alert('Email o contraseña incorrectos!');
      }

    } else {
      alert('Rellene los campos!');
    }
  }

  const handleMessageButtonClick = () => {
    navigation.reset({
      routes: [{name: 'SignUp'}]
    });
  }

  return (
    <Container>
      <BarberLogo width="100%" height="160" />

      <InputArea>

        <SignInput 
          IconSvg={EmailIcon} 
          placeholder="Ingrese su e-mail" 
          value={emailField} 
          onChangeText={t=>setEmailField(t)}
        />

        <SignInput 
          IconSvg={LockIcon} 
          placeholder="Ingrese su contraseña" 
          value={passwordField} 
          onChangeText={t=>setPasswordField(t)} 
          password={true}
        />

        <CustomButton onPress={handleSignClick}>
          <CustomButtonText>LOGIN</CustomButtonText>
        </CustomButton>

      </InputArea>

      <SignMessageButton onPress={handleMessageButtonClick}>
        <SignMessageButtonText>Aun no posee una cuenta?</SignMessageButtonText>
        <SignMessageButtonTextBold>Registrarse</SignMessageButtonTextBold>
      </SignMessageButton>

    </Container>
  );
}