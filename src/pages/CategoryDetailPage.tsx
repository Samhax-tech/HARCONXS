import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ShopPage } from './ShopPage';
import { CategoryType } from '../types';

export const CategoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const validCategories: CategoryType[] = ['men', 'women', 'unisex', 'couples', 'custom', 'digital', 'bot-panels'];

  if (!slug || !validCategories.includes(slug as CategoryType)) {
    return <ShopPage categoryOverride="all" />;
  }

  return <ShopPage categoryOverride={slug as CategoryType} />;
};
