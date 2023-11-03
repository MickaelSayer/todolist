import { registerReactControllerComponents } from '@symfony/ux-react';
import './bootstrap.js';
import './styles/app.scss';
import '/node_modules/bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';

registerReactControllerComponents(require.context('./react/controllers', true, /\.(j|t)sx?$/));