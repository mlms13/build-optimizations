# Optimized Gulp Builds

### This one weird trick...

This repository showcases a variety of not-that-weird tricks to speed up your Gulp builds. Most of these techniques focus on "incremental" builds (rebuilding only the files that changed), however there are some general best practices sprinkled in for good measure.

- **Master** is the naive brnach, showing a common gulpfile with minimal optimizations
- **Incremental** is the improved branch, featuring Watchify, `gulp-cached`, and a few handy Browserify parameters

Read [the full article on these techniques](http://io.pellucid.com/blog/tips-and-tricks-for-faster-front-end-builds) on the Pellucid blog to see how we cut our rebuild times to about 20% of their original length.
