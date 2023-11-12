#!/bin/sh

mkdir -p checkout
cd checkout

if [ -d "clipper" ]; then
    echo "Found clipper"
else
    echo "Checking out clipper"
    bzr checkout --lightweight  http://fg.oisin.rc-harwell.ac.uk/anonscm/bzr/clipper/trunk/ clipper
    echo
fi 

if [ -d "mmdb2" ]; then
    echo "Found mmdb2"
else
echo "Checking out mmdb2"
bzr checkout --lightweight  http://fg.oisin.rc-harwell.ac.uk/anonscm/bzr/mmdb2/trunk/ mmdb2
echo
fi

if [ -d "libccp4" ]; then
    echo "Found libccp4"
else
    echo "Checking out libccp4"
    bzr checkout --lightweight  http://fg.oisin.rc-harwell.ac.uk/anonscm/bzr/libccp4/trunk/ libccp4
    echo
fi 



if [ -d "fftw-2.1.5" ]; then
    echo "Found fftw-2.1.5"
else

echo "Downloading out fftw-2.1.5"
curl -L http://www.fftw.org/fftw-2.1.5.tar.gz -o fftw-2.1.5.tar.gz
echo
echo "Unpacking fftw-2.1.5"
tar xf fftw-2.1.5.tar.gz
echo
fi

cd ..