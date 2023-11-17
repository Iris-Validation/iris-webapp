cmake_minimum_required(VERSION 3.12)
project(iris LANGUAGES C CXX)

# set(CMAKE_VERBOSE_MAKEFILE TRUE)

SET(iris_CC_FLAGS "-O2 -w")
SET(iris_CXX_FLAGS "-O2 -w -fwasm-exceptions -I${CMAKE_INSTALL_PREFIX}/include --bind -lnodefs.js --profiling")
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} ${iris_CC_FLAGS}")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${iris_CXX_FLAGS} ")
# add_compile_options(-std=c++11)

# option(BUILD_SHARED_LIBS "Build as a shared library" ON)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_STANDARD 11)

# set(CMAKE_C_COMPILER "gcc")
# set(CMAKE_CXX_COMPILER "/Users/dialpuri/Development/privateer/emsdk/upstream/emscripten/em++")
add_link_options(-sDEFAULT_PTHREAD_STACK_SIZE=2MB -sSTACK_SIZE=5MB)
add_compile_options(--preload-file data@/)

if (MODE STREQUAL "TESTING") 
else() 
add_subdirectory(fftw)
add_subdirectory(rfftw)
add_subdirectory(ccp4)
add_subdirectory(mmdb2)
add_subdirectory(clipper/minimol)
add_subdirectory(clipper/core)
add_subdirectory(clipper/ccp4)
add_subdirectory(clipper/contrib)
add_subdirectory(clipper/cns)
add_subdirectory(clipper/mmdb)
add_subdirectory(clipper/cif)
add_subdirectory(clipper/phs)
endif()

include_directories(
    ${CMAKE_CURRENT_SOURCE_DIR}
    checkout/mmdb2 
    checkout/clipper 
    checkout/gemmi/include
    checkout/libccp4/ccp4 
)

link_directories(
    checkout/mmdb2
    checkout/clipper
    checkout/libccp4/ccp4     
    ${CMAKE_CURRENT_SOURCE_DIR}/src
)

add_library(
    iris_lib
    ${CMAKE_CURRENT_SOURCE_DIR}/src/iris-backend.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/iris-bind.cpp

)

add_executable(iris_exec ${CMAKE_CURRENT_SOURCE_DIR}/src/iris-bind.cpp)
set_target_properties (iris_exec PROPERTIES OUTPUT_NAME iris )
target_link_options(iris_exec PRIVATE --preload-file data@/ -sDEMANGLE_SUPPORT=1 -sASSERTIONS=2 -fexceptions -sALLOW_MEMORY_GROWTH=1 --bind -sFORCE_FILESYSTEM=1 -sMODULARIZE=1 -sEXPORT_NAME=iris_module -sEXPORTED_RUNTIME_METHODS=['FS'] -sMODULARIZE=1 -sEXPORT_ES6=1 --bind -lnodefs.js --profiling)

target_link_directories(iris_exec
 PUBLIC 
 mmdb2 
 clipper/mmdb 
 clipper/cif 
 clipper/core 
 clipper/contrib 
 clipper/ccp4 
 clipper/gemmi
 clipper/minimol
 fftw 
 rfftw 
 ccp4
 ../checkout/gemmi
 )

target_link_libraries(
    iris_exec
    iris_lib
    ccp4
    mmdb2
    clipper-mmdb
    clipper-cif
    clipper-core 
    clipper-contrib 
    clipper-ccp4 
    clipper-minimol
    fftw 
    rfftw 
    )

set(iris_HEADERS
    ${CMAKE_CURRENT_SOURCE_DIR}/src/iris-backend.h
)

set_target_properties(iris_exec PROPERTIES PUBLIC_HEADER "${iris_HEADERS}")
set_target_properties(iris_exec PROPERTIES COMPILE_FLAGS "-s ENVIRONMENT='web'")

install(TARGETS iris_lib
    LIBRARY DESTINATION lib
    PUBLIC_HEADER DESTINATION include/iris
)

install(FILES ${CMAKE_CURRENT_BINARY_DIR}/ciris.wasm
${CMAKE_CURRENT_BINARY_DIR}/ciris.js
DESTINATION ${CMAKE_CURRENT_SOURCE_DIR}/webserver/wasm)