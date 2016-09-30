# psd-extract

Atom.io package which helps to extract information from photoshop layers.

![psd-extract](http://skersgatvis.lt/psd-extract.png)

It's very early version so it only collects css information, below is all supported css properties:

    width
    height
    top ( in psd document )
    bottom ( in psd document )
    font-size
    font-family
    font-weight
    color ( rgb/rgba )
    line-height
    background-color ( rgb/rgba )
    background-image: linear-gradient ( not tested with complex gradients )
    text-shadow
    box-shadow
    opacity
    border
    border-radius
    text-transform ( uppercase only )
