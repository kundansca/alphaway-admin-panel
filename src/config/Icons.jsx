// src/config/Icons.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPen,
  faTrash,
  faEye,
  faPlus,
  faSearch,
  faBox,     // Use faBox instead of "faProduct"
  faShoppingCart // Use faShoppingCart instead of "faOrder"
} from '@fortawesome/free-solid-svg-icons';


export const SearchIcon = React.memo(() => (
  <FontAwesomeIcon icon={faSearch} title="Search" />
));

export const ProductIcon = React.memo(() => (
  <FontAwesomeIcon icon={faBox} title="PRODUCT" />
));

export const OrderIcon = React.memo(() => (
  <FontAwesomeIcon icon={faShoppingCart} title="ORDER" />
));

export const ViewIcon = React.memo(() => (
  <FontAwesomeIcon icon={faEye} title="VIEW DETAILS" />
));

export const EditIcon = React.memo(() => (
  <FontAwesomeIcon icon={faPen} title="EDIT" />
));

export const DeleteIcon = React.memo(() => (
  <FontAwesomeIcon icon={faTrash} title="DELETE" />
));

export const AddIcon = React.memo(() => (
  <FontAwesomeIcon icon={faPlus} title="ADD" />
));
