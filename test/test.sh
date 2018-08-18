#!/bin/bash

set -e

E="src/main.js"

$E 

$E list
$E add
$E remove
$E get

## User

$E list user

echo "Add user"
$E add user test123 -p abdefg

echo "List users"
$E list user

echo "Get added user"
$E get user test123

echo "Remove added user"
$E remove user test123

echo "List users"
$E list user

## Role

$E list role
$E add role testrole
$E get role testrole
$E list role
$E remove role testrole
$E list role

## Group

$E list group

## Project

$E list project
$E add project testproject
$E list project
$E get project testproject
$E remove project testproject
$E list project

## Schema

$E list schema

## Project Schemas

$E list projectSchema
$E list projectSchema demo

## Tagfamily

$E list tagfamily
