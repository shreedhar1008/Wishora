import { Metadata } from 'next';
import ExploreClient from './ExploreClient';

export const metadata: Metadata = {
  title: 'Explore | Wishora',
  description: 'Explore public wishes created by the Wishora community.',
};

export default function ExplorePage() {
  return <ExploreClient />;
}
