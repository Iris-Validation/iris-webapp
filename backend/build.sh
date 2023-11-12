source ../emsdk/emsdk_env.sh

emcmake cmake . 
emmake make -j

mv iris* ../frontend/iris/api
mv ../frontend/iris/api/iris.data ../frontend/iris/public