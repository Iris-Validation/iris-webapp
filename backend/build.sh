source ../emsdk/emsdk_env.sh

emcmake cmake . 
emmake make -j

mv iris* ../frontend/src/api
mv ../frontend/src/api/iris.data ../frontend/public