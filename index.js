import React from 'react';
import { createRoot } from 'react-dom/client';
import UploadScheduler from './UploadScheduler';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<UploadScheduler />);
