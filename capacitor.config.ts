import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.atplvector.app',
  appName: 'ATPL Vector',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
