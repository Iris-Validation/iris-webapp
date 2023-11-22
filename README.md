# Iris Webapp

The Iris validation framework provides new and old metrics mapped onto an innovative graphical representation available through a web app. This app is powered by React and WebAssembly.

## Developer Installation

### **Backend Compilation instructions**

**Requirements** 

* A Bourne-like shell
* bzr
* git
* curl
* patch
* emsdk (Steps 1 and 2 below)
* cmake
* A *native* C++ compiler. (This is required for part of the `boost` build system).
* `autoconf`,`autotools`
* `libtool`

1. Install emscripten (following  [https://emscripten.org/docs/getting_started/downloads.html](https://emscripten.org/docs/getting_started/downloads.html)):  
`git clone https://github.com/emscripten-core/emsdk.git`  
`cd emsdk`  
`git pull`  
`./emsdk install latest`  
`./emsdk activate latest`

2. Each time you want to use emscripten:  
`source ./emsdk_env.sh`

3. Get the sources:  
`git clone https://github.com/Dialpuri/iris-webapp.git iris-webapp`  
`cd iris-webapp/backend`  
`./get_sources`

4. Build required libraries and privateer WASM module using:  
`emcmake cmake .`  
`emmake make .`

### **Frontend instructions**

**Requirements** 

* npm

1. Navigate to frontend directory:
   
   `cd frontend`

3. Install node modules:
   
   `npm install`

5. Build the app:
   
   `npm run build`

7. Serve the app:
   
   `npm run dev`

Upon any changes to the frontend code, you may need to rerun `npm run build` for the changes to be reflected in the local development server. 
