import { Slot } from 'expo-router';
import '../styles/global.css';
import { StatusBar } from 'expo-status-bar';

const RootLayout = () => {
  return (
    <>
      <Slot />
      <StatusBar style="auto" />
    </>
  );
};

export default RootLayout;
