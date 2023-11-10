import { registerReactControllerComponents } from '@symfony/ux-react';
import './bootstrap.js';
import './styles/app.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';

registerReactControllerComponents(require.context('./react/controllers', true, /\.(j|t)sx?$/));