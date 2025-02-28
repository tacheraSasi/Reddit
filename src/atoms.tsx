import { atom } from "jotai";
import { Tables } from "./types/database.types";

type Group = Tables<"groups">;

export const selectedGroupAtom = atom<Group | null>(null);
