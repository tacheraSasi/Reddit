import { atom } from 'jotai';
import { Group } from './types';

export const selectedGroupAtom = atom<Group | null>(null)