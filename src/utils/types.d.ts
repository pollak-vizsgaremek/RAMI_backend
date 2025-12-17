import type e from "express";
import type { ObjectId } from "mongodb";

export interface oktatok{
    _id?: ObjectId;
    nev: string;
    atlagPont: number;
}

export interface iskolak{
    _id?: ObjectId;
    nev: string;
    cim: string;
}

export interface users{
    _id?: ObjectId;
    username: string;
    password: string;
    szuletesiDatum: Date;
    email: string;
    nem: string;
}

export interface vizsgaUtvonalak{
    _id?: ObjectId;
    azonosito: number;
    helyszin: string;
}

export interface ertekelesek{
    _id?: ObjectId;
    szoveg: string;
    pontszam: number;
}

export interface apiKey {
  _id?: ObjectId;
  Key: string;
  name: string;
}