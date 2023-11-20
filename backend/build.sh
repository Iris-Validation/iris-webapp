source ../emsdk/emsdk_env.sh

emcmake cmake . 
emmake make -j

mv iris-api* ../frontend/src/api
mv ../frontend/src/api/iris-api.data ../frontend/public/iris-api.data