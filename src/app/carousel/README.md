# Carousel Frame

This frame is a way to string together a number of pages in a scrolling carousel.

The general idea is that the user navigates through your pages like:
```
0 -> 1 -> 2 -> 3 -> ... -> end
```

## Configuration 

![](../../../public/images/docs/carousel-example.png)

See [configs.ts](./configs.ts) for how to configure, each page has a unique image, and can have up to 4 buttons:
1. Previous navigation: configurable label and also ability to disable prev navigation, not present on the first page
2. Next navigation: configurable label, always present except for the last page
3. Redirect: configurable redirection to bring the user to an external link
4. Compose: configurable composability to seamlessly go to another frame

There is also additional query parameter, which can override composability on the last page of the carousel.
This allows another frame to use the carousel, and at the end go back, or go to the another frame! 
That is next level composability! 
* `completion-compose-label`: override for the last page compose button label for the carousel
* `completion-compose-url`: override for last page compose post url for the carousel 
Note: you need to make sure the entire url is <256 characters 

If you don't want to allow composability, or want to restrict which users can cast this frame, you can add FID's to the `allowedCasterFids` array. If the caster is not in this array, the frame will show an error upon first interaction.

