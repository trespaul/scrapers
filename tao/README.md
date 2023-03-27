# tao.json

Get the Tao in JSON format from yellowbridge.com.


Download the source files:

```zsh
wget "https://www.yellowbridge.com/onlinelit/daodejing[1-81].php?characterMode=s"
```

Convert to JSON:

```zsh
python do.py daodejing??.html > tao.json
```
