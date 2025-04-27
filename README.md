## Minimal UI ([Free version](https://free.minimals.cc/))

![license](https://img.shields.io/badge/license-MIT-blue.svg)

## Pages

- [Dashboard](https://free.minimals.cc/)
- [Users](https://free.minimals.cc/user)
- [Products](https://free.minimals.cc/products)
- [Blog](https://free.minimals.cc/blog)
- [Sign in](https://free.minimals.cc/sign-in)
- [Not found](https://free.minimals.cc/404)

## Quick start

- Clone the repo: `git clone https://github.com/minimal-ui-kit/material-kit-react.git`
- Recommended: `Node.js v20.x`
- **Install:** `npm i` or `yarn install`
- **Start:** `npm run dev` or `yarn dev`
- **Build:** `npm run build` or `yarn build`
- Open browser: `http://localhost:3039`

## License

Distributed under the [MIT](https://github.com/minimal-ui-kit/minimal.free/blob/main/LICENSE.md) license.

## Contact us

Email: support@minimals.cc


                        {/* Harga Asli */}
                        {/* <TableCell align="center">
                          <NumericFormat
                            customInput={TextField}
                            fullWidth
                            value={rows[index].hargaAsli}
                            onValueChange={(values) => handleHargaAsliChange(index, values.value)}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="Rp "
                          />
                        </TableCell> */}

                        {/* Harga Diskon */}
                        {/* <TableCell align="center">
                          <NumericFormat
                            customInput={TextField}
                            fullWidth
                            value={rows[index].hargaDiskon}
                            onValueChange={(values) => handleHargaDiskonChange(index, values.value)}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="Rp "
                          />
                        </TableCell> */}

                        {/* Diskon % */}
                        {/* <TableCell align="center">
                          <Box
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'start',
                            }}
                          >
                            <TextField
                              fullWidth
                              type="number"
                              value={rows[index].diskonPersen}
                              onChange={(e) => handleDiskonPersenChange(index, e.target.value)}
                              InputProps={{
                                endAdornment: <InputAdornment position="start">%</InputAdornment>,
                              }}
                            />


                            <Typography variant="caption" color="textSecondary" mt={1}>
                              {rows[index].hargaAsli && rows[index].hargaDiskon
                                ? `Potongan Rp${(
                                    parseFloat(
                                      rows[index].hargaAsli.replace(/\./g, '').replace(',', '.')
                                    ) -
                                    parseFloat(
                                      rows[index].hargaDiskon.replace(/\./g, '').replace(',', '.')
                                    )
                                  )
                                    .toLocaleString('id-ID')
                                    .replace(',', '.')}`
                                : ''}
                            </Typography>
                          </Box>
                        </TableCell> */}
