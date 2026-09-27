# Hanova

> [!TIP]
> **Demo here: <https://thestarviper.github.io/hanova/>**

Hanova is a local web-based suite of file transformation tools that keeps all your files from touching an external server so that they stay secure. This file converter was made for Hackclub's YSWS event [Third Space](https://thirdspace.hackclub.com/). The frontend utilizes a pirate-esque theme that makes it stand out from other file converters online. When converting a file a pirate ship is summomed and travels to the island representing the file type you want to convert to and arrives at the island to dig up your treasure (your file) once the file conversion is done.

## Supported File Formats
    - [x] png
    - [x] jpeg
    - [x] bmp
    - [ ] tga
    - [ ] hdr
    - [ ] ico
    - [ ] gif
    - [ ] webp
    - [ ] tiff
    - [ ] avif
    - [ ] heif
    - [ ] heic
    - [ ] svg
    - [ ] eps
<details>
  <summary>Image Formats</summary>
  
  <p>
    <label><input type="checkbox" name="option1" value="1"> Option 1</label><br>
    <label><input type="checkbox" name="option2" value="2"> Option 2</label><br>
    <label><input type="checkbox" name="option3" value="3" checked onclick="return false;"> Option 3</label>

  </p>
</details>
### Audio
- [ ] mp3
- [ ] wav
- [ ] avif
- [ ] flac
- [ ] ogg
- [ ] aac
- [ ] m4a
### Docs
- write this later
### 3D files
- write this lataer
> [!NOTE]
> Video conversion locally has no access to hardware accelleration so we are unable to do it reasonably without an external server. In the future we may dable with the idea of making video formats available via self hosted docker container.
## Compiling yourself

Prerequisites:

- [pnpm](https://pnpm.io/installation)
- [emscripten](https://emscripten.org/docs/getting_started/downloads.html)

```sh
# clone the repo
git clone https://github.com/TheStarViper/hanova.git
cd hanova

# regenerate the wasm (optional but recommended)
make -C backend

# start the site
cd frontend
pnpm install
pnpm dev
```

## **Contributers**

- Ethan ([@ethmarks](https://github.com/ethmarks)): Frontend in Svelte
- Andrew ([@TheStarViper](https://github.com/TheStarViper)): Backend in C++