"use client";
import { Box, Button, Chip, InputAdornment, MenuItem, Modal, Popover, Select, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack, Switch, TextField, Typography, useMediaQuery } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import IconButton from "@mui/material/IconButton";
import React from "react";
import { GithubPicker } from 'react-color';
import { AlarmOn, BackHand, Close, Flag, FlagCircle, FrontHandOutlined, LabelImportant, MoreHoriz, Pause, PlayArrow, PunchClock, Settings } from "@mui/icons-material";
import { CogIcon } from "@heroicons/react/24/solid";

export default function Timer() {
    const [timeLeft, setTimeLeft] = React.useState(10)
    const [timePerRound, setTimePerRound] = React.useState(60)
    const [timePerTurn, setTimePerTurn] = React.useState(30)
    const [players, setPlayers] = React.useState<string[]>([])
    const [playerColours, setPlayerColours] = React.useState<string[]>([])
    const [newPlayer, setNewPlayer] = React.useState<string>("")
    const [currentPlayer, setCurrentPlayer] = React.useState<number>(0)

    const [firstPlayerTokenMode, setFirstPlayerTokenMode] = React.useState(0) // 0 = none, 1 = random each round, 2 = move each round, 3 = stealable
    const [turnNumber, setTurnNumber] = React.useState(0) // number of turns taken in current game
    const [roundNumber, setRoundNumber] = React.useState(0) // number of rounds taken in current game
    const [totalTimePerPlayer, setTotalTimePerPlayer] = React.useState([0])
    const [_playerStats, setPlayerStats] = React.useState([0])
    const [negativeTimeOverFlow, setNegativeTimeOverflow] = React.useState(false)
    const [positiveTimeOverflow, setPositiveTimeOverflow] = React.useState(true)
    const [roundsEnabled, setRoundsEnabled] = React.useState(false)
    const [premovingEnabled, setPremovingEnabled] = React.useState(false)
    const [premoves, setPremoves] = React.useState<number[]>([]) // array of indexes of players who have premoved (only one per player)
    const [playersPassed, setPlayersPassed] = React.useState<number[]>([]) // array of indexes of players who have passed this round
    const [firstPlayer, setFirstPlayer] = React.useState(0) // index of first player in current round
    
    // TODO colour list for different games
    // const gameColours = {
    //     // 'Catan': ['#ff1500ff', '#25bb78ff', '#e7f824ff', '#5777d7ff'],
    //     // 'Monopoly': ['#ff1500ff', '#25bb78ff', '#e7f824ff', '#5777d7ff', "#FFFFFF", "#000000ff"],
    //     // 'Ticket to Ride': ['#ff1500ff', '#25bb78ff', '#e7f824ff', '#5777d7ff', '#FCB900', '#9900EF'],
    //     // 'Carcassonne': ['#ff1500ff', '#25bb78ff', '#e7f824ff', '#5777d7ff', '#df25baff', '#14eba3ff'],
    //     // 'Pandemic': ['#ff1500ff', '#25bb78ff', '#e7f824ff', '#5777d7ff', '#516d77ff', '#339c75ff', '#94a5dcff', '#9bcecbff']
    //     'Terraforming Mars': ['#ff1500ff', '#18ab50', '#12329dff', '#64e23eff', '#20081bff']
    // }
    // TODO select game to get preset colours
    const colours = 
    ['#ff1500ff', '#25bb78ff', '#e7f824ff', '#5777d7ff', "#FFFFFF", "#000000ff", '#FCB900', '#9900EF', '#df25baff', '#14eba3ff', '#516d77ff', '#339c75ff', '#94a5dcff', '#9bcecbff']
    // DONE nicer player list
    // DONE timer button / screen opens as fullscreen modal
    // DONE colours with each player   
    // TODO premove corner
    // queue in corner with next few players
    // players can tap to complete premove
    // TODO stretch: simultaneous multi-game timer
    // TODO pause/play, back, finish buttons
    // TODO stretch play time stats on game end
    // TODO scorer helper (anonymous score entry and then reveal)
    // TODO save stats to google sheets (use api key and env variables)
    // TODO first player
    // TODO timer modes
    // - simple turn timer (current)
    // - time per round (all players get timePerTurn each round, then next round)
    const [open, setOpen] = React.useState(false)
    const [endTime, _setEndTime] = React.useState([Date.now()])
    const [editingColour, setEditingColour] = React.useState(false)
    const [colourEditTarget, setColourEditTarget] = React.useState(-1)
    const [newColour, setNewColour] = React.useState(colours[0])
    const [speedDialOpen, setSpeedDialOpen] = React.useState(false)
    const pauseValue = React.useState([true])[0]
    const [paused, setPaused] = React.useState(true)
    function decrementTimer(end: number[], pause: any[]) {
            console.log(pause[0])
        
        if (pause && !pause[0]) {
            const time = end[0] - Date.now();
            // console.log(end, time)
            console.log(currentPlayer, time)
            setTimeLeft(time)
        }
    }

    function pauseTimer() {
        pauseValue[0] = true
        setPaused(true)
    }

    function unpauseTimer() {
        pauseValue[0] = false
        setPaused(false)
    }

    function clearPause() {
        pauseValue[0] = false
        setPaused(false)
    }

    function nextPlayer() {
        setTurnNumber(turnNumber + 1)

        // set leftover time from player if positive overflow enabled
        if (positiveTimeOverflow) {
            totalTimePerPlayer[currentPlayer] = Math.max(timeLeft, 0)
        }
        if (negativeTimeOverFlow && timeLeft < 0) {
            totalTimePerPlayer[currentPlayer] = timeLeft
        } else {
        }
        let nextPlayerInRound = (currentPlayer + 1) % players.length
        if (roundsEnabled) {
            // if player has already passed, skip them
            nextPlayerInRound = (currentPlayer + 1) % players.length
            console.log(playersPassed, nextPlayerInRound, playersPassed.includes(nextPlayerInRound))
            if (playersPassed.includes(nextPlayerInRound)) {
                // if all players have passed, end round
                console.log('player has already passed, skipping')
                if (playersPassed.length === players.length) {
                    nextRound()
                    return
                }
                // otherwise, skip to next player
                while (playersPassed.includes(nextPlayerInRound)) {
                    nextPlayerInRound = (nextPlayerInRound + 1) % players.length
                }
            }
        }
        setCurrentPlayer(nextPlayerInRound)
        endTime[0] = (Date.now() + totalTimePerPlayer[nextPlayerInRound] + timePerTurn * 1000)

        decrementTimer(endTime, [false])
        // console.log('next player', nextPlayerInRound, 'timeLeft', timeLeft, totalTimePerPlayer[nextPlayerInRound])

        // console.log('set end time', endTime)
        // console.log('set player to', currentPlayer)
        clearPause()
        
        // TODO handle premoves
    }
    function nextRound() {
        setRoundNumber(roundNumber + 1)
        setPlayersPassed([])
        setFirstPlayer((firstPlayer + 1) % players.length)
        setCurrentPlayer((firstPlayer + 1) % players.length)
        // setCurrentPlayer(0) // set to "first player"
        setTotalTimePerPlayer(Array(players.length).fill(timePerRound * 1000)) // TODO change to starting time

        
        endTime[0] = Date.now() + totalTimePerPlayer[currentPlayer] + timePerTurn * 1000
        totalTimePerPlayer[currentPlayer] = totalTimePerPlayer[currentPlayer] + timePerTurn * 1000
        // endTime[0] = (Date.now() + timePerRound * 1000)
        decrementTimer(endTime, [false])
        console.log('set end time', endTime)
        console.log('set player to', currentPlayer)
        clearPause()
        // TODO handle premoves
    }

    function startTimer() {
        if (players.length === 0) return;
        setTotalTimePerPlayer(Array(players.length).fill(timePerRound * 1000)) // TODO change to starting time
        // endTime[0] = Date.now() + timePerRound * 1000 + timePerTurn * 1000
        endTime[0] = Date.now() + totalTimePerPlayer[currentPlayer] + timePerTurn * 1000
        setPlayerStats(Array(players.length).fill(0))
        setCurrentPlayer(firstPlayer)
        setPlayersPassed([])
        setPremoves([])
        clearPause()
        decrementTimer(endTime, [false])
        setOpen(true)
    }

    function reset() {
        setTotalTimePerPlayer(Array(players.length).fill(timePerRound * 1000))
        setCurrentPlayer(0)
        setTimeLeft(timePerTurn * 1000)
        // clearPause() // or true?
        pauseTimer()
        setPlayersPassed([])
        setPremoves([])
        setOpen(false)
        setRoundNumber(0)
        setTurnNumber(0)
    }

    function deletePlayer(i: number) {
        setPlayers(players.filter((_val, idx) => idx !== i))
        setPlayerColours(playerColours.filter((_val, idx) => idx !== i))
        setNewColour(colours[players.length % colours.length])
    }
    
    React.useEffect(() => {
        const interval = setInterval(() => decrementTimer(endTime, pauseValue), 1000);
        return () => clearInterval(interval);
    }, []);

    function colorIsDarkSimple(bgColor: string) {
        if (!bgColor) return false; // default to light if undefined
        let color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
        let r = parseInt(color.substring(0, 2), 16); // hexToR
        let g = parseInt(color.substring(2, 4), 16); // hexToG
        let b = parseInt(color.substring(4, 6), 16); // hexToB
        return ((r * 0.299) + (g * 0.587) + (b * 0.114)) <= 180;
    }

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);    
    const openColourPicker = (event: any, i=-1) => {
        setColourEditTarget(i)
        setAnchorEl(event.currentTarget);
        setEditingColour(true)
    };

    const [firstPlayerSettingsOpen, setFirstPlayerSettingsOpen] = React.useState(false)

    React.useEffect(() => {
        if (players.length == 0) setFirstPlayer(-1)
        else setFirstPlayer(firstPlayer % players.length)
    }, [players])

    // let noSleep = new NoSleep();
    // React.useEffect(() => {
    //     const enableNoSleep = () => {
    //         document.removeEventListener('click', enableNoSleep);
    //         noSleep.enable();
    //     };
        
    //     document.addEventListener('click', enableNoSleep);
        
    //     return () => {
    //         document.removeEventListener('click', enableNoSleep);
    //     };
    // }, []);
    // const device = useStayAwake();
    const isMobile = useMediaQuery('(max-width: 768px)');
    // React.useEffect(() => {
    //     const handleResize = () => {
    //         isSmallDevice = window.matchMedia('(max-width: 768px)').matches;
    //         // Add any responsive logic here
    //         // For example, you could set a state variable:
    //         // setIsSmallDevice(isSmallDevice);
    //     };

    //     // Initial check
    //     handleResize();

    //     // Add event listener
    //     window.addEventListener('resize', handleResize);

    //     // Cleanup
    //     return () => window.removeEventListener('resize', handleResize);
    // }, []);
    return <>
            <div className="container mx-auto p-8">
                <h1 className="text-4xl font-bold mb-4">Board Game Timer</h1>
                <p className="mb-4">Customisable timer for multiple players</p>

            </div>

            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">Settings</h2>
                

                
                <Stack sx={{ maxWidth: '300px', margin: '0px auto'}} spacing={2}>
                    <TextField
                        label="new player"
                        value={newPlayer}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setNewPlayer(event.target.value);
                        }}
                        placeholder="player"
                        slotProps={{
                            input: {
                            startAdornment: (
                                <>
                                <Button style={{background: newColour}} onClick = {(e) => openColourPicker(e)}></Button>

                                <Popover
                                    anchorEl={anchorEl}
                                    open = {editingColour}
                                    onClose = {() => setEditingColour(false)}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                >
                                    <GithubPicker color="ababab" colors={colours} onChangeComplete={(e: { hex: React.SetStateAction<string>; }) => {
                                        console.log(e.hex)
                                        console.log(colourEditTarget)
                                        if (colourEditTarget === -1) {
                                            // change for new field
                                            setNewColour(e.hex)
                                        } else {
                                            // change for a certain player index
                                            playerColours[colourEditTarget] = e.hex as string
                                        }
                                        setEditingColour(false)
                                    }}/>
                                </Popover>
                                </>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                <IconButton onClick={() => {
                                    if (newPlayer !== "") {
                                        setNewColour(colours[(players.length+1) % colours.length])
                                        setPlayers([...players, newPlayer])
                                        setPlayerColours([...playerColours, newColour])
                                        setNewPlayer("")
                                    }
                                }}>
                                    <AddIcon />
                                </IconButton>
                                </InputAdornment>
                            ),
                            },
                        }}
                        variant="outlined"
                    ></TextField>
                    {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker 
                        views={['minutes', 'seconds']} format="mm:ss" onChange={(event: any) => {
                            console.log(event)
                            console.log(event["$m"], event["$s"])
                            setTimePerTurn(event["$m"] * 60 + event["$s"])
                        } 
                            }/>
                    </LocalizationProvider> */}
                    <TextField
                        label="time per turn (seconds)"
                        type="number"
                        value={timePerTurn}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            // TODO strip leading zeros
                            setTimePerTurn(Math.floor(Number(event.target.value)));
                            console.log(timePerTurn)
                        }}
                        variant="outlined"
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="start">
                                        <PunchClock />
                                    </InputAdornment>
                                ),
                            },
                            
                        }}
                    />
                    <TextField
                        label={roundsEnabled ? "time per round (seconds)" : "starting time (seconds)"}
                        type="number"
                        value={timePerRound}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setTimePerRound(Number(event.target.value));
                            console.log(timePerRound)
                        }}
                        variant="outlined"
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="start">
                                        <PunchClock />
                                    </InputAdornment>
                                ),
                            },
                            
                        }}
                    />
                    <Button onClick={() => {
                        if (players.length === 0) return;
                        startTimer()
                    }}>start</Button>
                    <Stack sx={{}} spacing={2}>
                        <div className="">
                            
                            <TextField
                                fullWidth
                                select
                                label="First Player"
                                value={firstPlayer.toString()}
                                onChange={(event: any) => {
                                    console.log(event.target.value)
                                    setFirstPlayer(Number(event.target.value))
                                }}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <IconButton>
                                                <FlagCircle/>
                                            </IconButton>
                                        )
                                    }
                                }}
                            >
                                <MenuItem value={-1}>Random</MenuItem>
                                {players.map((p, i) => {
                                    return <MenuItem value={i}>{p}</MenuItem>
                                })}

                            </TextField>
                        </div>
                        {players.map((x,i) => 
                            <>
                                <Chip label = {x} variant="outlined" 
                                icon={i == firstPlayer ? <FlagCircle style= {{color:colorIsDarkSimple(playerColours[i]) ? "white": "black"}}/> : <></>}
                                onClick={(e) => openColourPicker(e, i)}
                                onDelete={() => deletePlayer(i)}
                                sx = {{color: colorIsDarkSimple(playerColours[i]) ? "white": "black", bgcolor: playerColours[i]}}
                                />
                            </>
                        )}
                    </Stack>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2, justifyContent: 'center' }}>
                    <Typography>Allow Time Overflow</Typography>
                    <Switch
                        checked={positiveTimeOverflow}
                        onChange={(event) => {
                            setPositiveTimeOverflow(event.target.checked);
                        }}
                    />
                </Stack>
                        <Typography className="">This enables leftover time to add to the next turn e.g. ending a turn with 30sec left means those 30 seconds are added to your next turn.</Typography>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2, justifyContent: 'center' }}>
                    <Typography>Allow Negative Time Overflow</Typography>
                    <Switch
                        checked={negativeTimeOverFlow}
                        onChange={(event) => {
                            setNegativeTimeOverflow(event.target.checked);
                        }}
                    />
                </Stack>
                        <Typography>This enables time deficits (taking longer than your time limit) to take away from your next turn e.g. ending a turn with 10 seconds overtime makes your next turn 10 seconds shorter</Typography>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2, justifyContent: 'center' }}>
                    <Typography>Use rounds (and passing)</Typography>
                    <Switch
                        checked={roundsEnabled}
                        onChange={(event) => {
                            setRoundsEnabled(event.target.checked)
                        }}
                    />
                </Stack>
                        <Typography>Rounds mean that each player can pass, where their turn will be skipped for the rest of that round. Each round has its own starting time.</Typography>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2, justifyContent: 'center' }}>
                    <Typography>Allow premoving</Typography>
                    <Switch
                        checked={premovingEnabled}
                        onChange={(event) => {
                            setPremovingEnabled(event.target.checked)
                        }}
                    />
                </Stack>
                        <Typography>This allows tapping your own place in the queue of players to indicate you have already completed your turn.</Typography>
                
                <Modal
                    open = {open}
                    onClose = {() => setOpen(false)}
                >
                    <Box>
                        {/* TODO instant transition with player change */}
                        <Box

                            sx={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                width: "100%",
                                height: `${Math.max(0, (timeLeft / (totalTimePerPlayer[currentPlayer % players.length] + timePerTurn*1000)) * 100)}%`,
                                background: playerColours[currentPlayer % players.length],
                                opacity: 1,
                                transition: 'height 0.5s linear',
                                zIndex: 0,
                            }}
                        >
                        </Box>
                        <Box
                            
                            sx={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                width: "100%",
                                height: "100%",
                                // Convert hex to HSL, add 180 degrees to hue for complementary color
                                background: playerColours[currentPlayer % players.length] ? (() => {
                                    const hex = playerColours[currentPlayer % players.length].replace('#', '');
                                    const r = parseInt(hex.slice(0, 2), 16);
                                    const g = parseInt(hex.slice(2, 4), 16);
                                    const b = parseInt(hex.slice(4, 6), 16);
                                    
                                    // Convert RGB towards grey, lighten if very dark
                                    const greyValue = (r + g + b) / 3;
                                    const mixFactor = 0.7; // 0 = original color, 1 = full grey
                                    const isVeryDark = greyValue < 30;
                                    const targetGrey = isVeryDark ? 128 : greyValue; // Move towards mid-grey if very dark
                                    const newR = Math.round(r * (1 - mixFactor) + targetGrey * mixFactor);
                                    const newG = Math.round(g * (1 - mixFactor) + targetGrey * mixFactor);
                                    const newB = Math.round(b * (1 - mixFactor) + targetGrey * mixFactor);
                                    return `rgb(${newR}, ${newG}, ${newB})`;
                                })() : 'black',
                            //    background: playerColours[(currentPlayer + 1)% players.length],
                                // background: 'black',
                                filter: 'brightness(0.8)', // Darkens the color
                                zIndex: -1,
                            }}
                        >
                        </Box>
                        <Box
                            onClick = {() => {
                                nextPlayer()
                                // setCurrentPlayer(currentPlayer + 1)

                                // endTime[0] = (Date.now() + timePerTurn * 1000)
                                // decrementTimer(endTime, [false])
                                // console.log('set end time', endTime)
                                // console.log('set player to', currentPlayer)
                                
                            }}
                            sx={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                width: "100%",
                                height: "100%",
                                zIndex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                
                                // color: colorIsDarkSimple(playerColours[currentPlayer % players.length]) ? "white": "black"
                            }}
                        >
                            <div className="text-center mb-8">
                                <Typography variant="h2" 
                                    sx={{ paddingTop: "20px", 
                                    color: colorIsDarkSimple(playerColours[currentPlayer % players.length]) ? "white": "black"}}
                                    >
                                    {players[currentPlayer % players.length]}
                                </Typography>
                            </div>
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                // justify-content: "center", /* Centers horizontally */
                                // align-items: "center",   /* Centers vertically */
                                // margin: 0;,  
                            }}
                            className="text-center mb-8"
                            >
                                <Typography variant="h1" 
                                sx={{ 
                                    paddingTop: "20px", 
                                    width: "fit-content",
                                    fontSize: isMobile ? '80pt' : '120pt',
                                    fontWeight: 'bold',
                                    borderRadius: '20px',
                                    paddingLeft: '20px',
                                    paddingRight: '20px',
                                    paddingBottom: '10px',
                                    // background: (timeLeft / (timePerTurn * 1000)) * 100 > 50 ? "rgba(0, 0, 0, 0.3)" : "rgba(255, 255, 255, 0.3)",
                                    background: playerColours[currentPlayer % players.length],
                                    color: colorIsDarkSimple(playerColours[currentPlayer % players.length]) ? "white": "black"
                                }}
                                >
                                    {timeLeft < 0 ? '-': ''}{Math.abs((timeLeft / 1000)/60) >= 1 ? (Math.floor((Math.abs(timeLeft) / 1000)/60).toString().padStart(2, '0') + " : ") : ""} {timeLeft < 0 ? Math.ceil(Math.abs(timeLeft)/1000 % 60).toString().padStart(2, '0') : Math.floor(Math.abs(timeLeft)/1000 % 60).toString().padStart(2, '0')}
                                </Typography>
                            </div>
                            <Typography variant="h4" 
                                sx={{ 
                                    position: 'fixed', 
                                    top: '20px', 
                                    left: '20px',
                                    color: colorIsDarkSimple(playerColours[currentPlayer % players.length]) ? "white": "black"
                                }}
                            >
                                Turn {turnNumber + 1}{roundsEnabled ? (", Round " + (roundNumber + 1)) : ""}
                            </Typography>
                            {/* <Button style={{background: "#ababab", position: 'fixed', right: '10%', bottom:' 10%'}}>
                                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                                next: {players[(currentPlayer + 1) % players.length]}
                                </Typography>
                            </Button> */}
                            
                            { players.map((_x, i) => 
                            <Button
                            variant="outlined"
                            // disabled if player has passed
                            // grey out if passed
                            style={{ fontSize: '16pt', 
                                color: colorIsDarkSimple(playerColours[i]) ? "white": "black", 
                                background: playersPassed.includes(i) ? "#ababab" : playerColours[i], 
                                borderColor: colorIsDarkSimple(playerColours[i]) ? "white": "black",
                                position: 'fixed', top: `${i}0%`, right: '0px', borderBottomRightRadius: '0px', borderTopRightRadius: '0px'}}
                            disabled={playersPassed.includes(i)}
                            onClick={(e) => {
                                e.stopPropagation()
                                // handle premove action
                                if (premovingEnabled && !playersPassed.includes(i) && !premoves.includes(i)) {
                                    setPremoves([...premoves, i])
                                    console.log('player premoved', (currentPlayer + i + 1) % players.length, premoves)
                                }
                            }}
                            >
                                {i === firstPlayer && <FlagCircle style={{width: '24px', height: '24px', marginRight: '8px'}}/>}
                                { premoves.includes(i) ? <BackHand style={{width: '24px', height: '24px', marginRight: '8px'}}/> : (playersPassed.includes(i) ? <FrontHandOutlined style={{width: '24px', height: '24px', marginRight: '8px'}}/> : null) }
                                {i == ((currentPlayer) % players.length) && <LabelImportant></LabelImportant>}{players[i]}
                            </Button>
                            )}
                            {/* <SpeedDial
                                ariaLabel="Timer Controls"
                                sx={{ position: 'fixed', bottom: 16, right: 100 }}
                                icon={<SpeedDialIcon />}
                                onClose = {() => setSpeedDialOpen(false)}
                                onOpen = {() => setSpeedDialOpen(true)}
                                onClick = {(e) => {
                                    e.stopPropagation()
                                    setSpeedDialOpen(!speedDialOpen)
                                }}
                                open = {speedDialOpen}
                                direction={"right"}
                            >
                                <SpeedDialAction
                                    key="pause"
                                    style={{opacity: 0}}
                                    icon={<>
                                    <Button style={{backgroundColor: 'white'}} startIcon={paused ? <PlayArrow /> : <Pause />}  > {paused ? 'Play' : 'Pause'} </Button>
                                    </>}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        if (paused) {
                                            console.log('unpause')
                                            console.log(endTime[0])
                                            unpauseTimer()
                                            console.log(timeLeft)
                                            endTime[0] = Date.now() + timeLeft
                                            console.log(endTime[0])
                                        } else {
                                            console.log('set pause')
                                            console.log(endTime[0])
                                            pauseTimer()
                                        }
                                    }}
                                />
                                <SpeedDialAction
                                    key="reset"
                                    icon={<Close />}
                                    slotProps = {{
                                        tooltip: {
                                            open: true,
                                            title: "Reset Timer",
                                            placement: 'top'
                                        }
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation()

                                        reset()
                                    }}
                                />
                                <SpeedDialAction
                                    key="finish"
                                    icon={<AlarmOn />}
                                    slotProps = {{
                                        tooltip: {
                                            open: true,
                                            placement: 'right',
                                            title: "test",
                                        }
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation()

                                        setOpen(false)
                                    }}
                                />
                                { // pass button if rounds enabled
                                    roundsEnabled && !playersPassed.includes(currentPlayer % players.length) &&
                                    <SpeedDialAction
                                    key="pass"
                                    slotProps = {{
                                        tooltip: {
                                            open: true,
                                            placement: 'right-end',
                                            title: "Pass Turn",
                                        }
                                    }}
                                    icon={<FrontHandOutlined />}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        // handle pass action
                                        setPlayersPassed([...playersPassed, currentPlayer % players.length])
                                        console.log('player passed', currentPlayer % players.length, playersPassed)
                                        if (playersPassed.length + 1 >= players.length) {
                                            // everyone has passed, start new round
                                            nextRound()
                                        } else {
                                            // move to next player
                                            nextPlayer()
                                        }
                                    }}
                                />}

                            </SpeedDial> */}
                            <Stack
                            direction="row"
                            style = {{position: 'fixed', 'bottom': '10%'}}
                            >
                                <IconButton
                                sx = {{background: playerColours[currentPlayer % players.length], color: colorIsDarkSimple(playerColours[currentPlayer % players.length]) ? "white": "black"}}
                                // sx = {{filter: "invertColours", mixBlendMode: "difference", color: "white"}}
                                // style = {{ position: 'fixed', 'left': '10px'}}
                                onClick = {
                                    (e) => {
                                    e.stopPropagation()
                                    if (paused) {
                                        console.log('unpause')
                                        console.log(endTime[0])
                                        unpauseTimer()
                                        console.log(timeLeft)
                                        endTime[0] = Date.now() + timeLeft
                                        console.log(endTime[0])
                                    } else {
                                        console.log('set pause')
                                        console.log(endTime[0])
                                        pauseTimer()
                                    }
                                    }}>
                                    {paused ? <PlayArrow sx ={{fontSize:"64pt"}}/> : <Pause sx ={{fontSize:"64pt"}}/>}
                                </IconButton>
                                <IconButton 
                                // sx = {{color: colorIsDarkSimple(playerColours[currentPlayer % players.length]) ? "white": "black"}}
                                sx = {{background: playerColours[currentPlayer % players.length], color: colorIsDarkSimple(playerColours[currentPlayer % players.length]) ? "white": "black"}}


                                onClick = {
                                    (e) => {
                                    e.stopPropagation()

                                    reset()
                                    }}>
                                    <Close sx ={{fontSize:"64pt"}}/>
                                </IconButton>
                                <IconButton 
                                // sx = {{color: colorIsDarkSimple(playerColours[currentPlayer % players.length]) ? "white": "black"}}
                                sx = {{background: playerColours[currentPlayer % players.length], color: colorIsDarkSimple(playerColours[currentPlayer % players.length]) ? "white": "black"}}


                                onClick = {
                                    (e) => {
                                    e.stopPropagation()

                                    setOpen(false)
                                    }}>
                                    <AlarmOn sx ={{fontSize:"64pt"}}/>
                                </IconButton>
                                { // pass button if rounds enabled
                                    roundsEnabled && !playersPassed.includes(currentPlayer % players.length) &&
                                    <IconButton 
                                    // sx = {{color: colorIsDarkSimple(playerColours[currentPlayer % players.length]) ? "white": "black"}}
                                    sx = {{background: playerColours[currentPlayer % players.length], color: colorIsDarkSimple(playerColours[currentPlayer % players.length]) ? "white": "black"}}
                                    onClick = {
                                        (e) => {
                                            e.stopPropagation()
                                            // handle pass action
                                            setPlayersPassed([...playersPassed, currentPlayer % players.length])
                                            console.log('player passed', currentPlayer % players.length, playersPassed)
                                            if (playersPassed.length + 1 >= players.length) {
                                                // everyone has passed, start new round
                                                nextRound()
                                            } else {
                                                // move to next player
                                                nextPlayer()
                                            }
                                        }
                                    }>
                                        <FrontHandOutlined sx ={{fontSize:"64pt"}}/>
                                    </IconButton>}
                                <IconButton
                                onClick = {
                                    (e) => {
                                    e.stopPropagation()
                                    setSpeedDialOpen(!speedDialOpen)
                                    }}
                                sx = {{background: playerColours[currentPlayer % players.length], color: colorIsDarkSimple(playerColours[currentPlayer % players.length]) ? "white": "black"}}
                                    >

                                        <MoreHoriz sx ={{fontSize:"64pt"}}/>
                                </IconButton>
                                </Stack>

                            </Box>
                        </Box>
                </Modal>
                <Modal
                    open = {speedDialOpen}
                    onClose = {() => setSpeedDialOpen(false)}
                >
                    <Box sx = {{maxWidth: '400px', margin: '100px auto',  spacing: '10px'}}>
                        <Typography variant="h4" 
                            sx={{ 
                                position: 'fixed', 
                                top: '20px', 
                                left: '20px',
                                color: colorIsDarkSimple(playerColours[currentPlayer % players.length]) ? "white": "black"
                            }}
                        >
                            Timer Paused
                        </Typography>
                        <Button style={{background: "#ababab", position: 'fixed', right: '10%', bottom:' 10%'}}>
                            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                            next: {players[(currentPlayer + 1) % players.length]}
                            </Typography>
                        </Button>
                        <Stack gap={'30px'}>
                        <Button
                            style={{backgroundColor: 'white'}}
                            startIcon={<AlarmOn />}
                            variant="outlined"
                            onClick = {
                                () => {
                                    nextRound()
                                }
                            }
                        >Next round</Button>
                        <Button
                            style={{backgroundColor: 'white'}}
                            startIcon={<Close />}
                            variant="outlined"
                            onClick={
                                () => {
                                    reset()
                                }
                            }
                        >Reset Timer</Button>
                        <Button
                            style={{backgroundColor: 'white'}}
                            startIcon={paused ? <PlayArrow /> : <Pause />}
                            variant="outlined"
                            onClick={
                                () => {
                                    setPaused(!paused);
                                    if (paused) {
                                        // Resume the timer
                                        startTimer();
                                    } else {
                                        // Pause the timer
                                        pauseTimer();
                                    }
                                }
                            }
                        >{paused ? 'Play' : 'Pause'}</Button>
                        <Button
                            style={{backgroundColor: 'white'}}
                            startIcon={<FlagCircle />}
                            variant="outlined"
                        >Set first player</Button>
                        <div style={{padding: '30px', backgroundColor: 'white', borderRadius: '10px'}}>
                        <TextField
                            style={{backgroundColor: 'white'}}
                            label="time per turn (seconds)"
                            type="number"
                            value={timePerTurn}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                // TODO strip leading zeros
                                setTimePerTurn(Math.floor(Number(event.target.value)));
                                console.log(timePerTurn)
                            }}
                            variant="outlined"
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="start">
                                            <PunchClock />
                                        </InputAdornment>
                                    ),
                                },
                                
                            }}
                        /></div>
                        <div style={{padding: '30px', backgroundColor: 'white', borderRadius: '10px'}}>
                        <TextField
                            style={{backgroundColor: 'white'}}
                            label={roundsEnabled ? "time per round (seconds)" : "starting time (seconds)"}
                            type="number"
                            value={timePerRound}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setTimePerRound(Number(event.target.value));
                                console.log(timePerRound)
                            }}
                            variant="outlined"
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="start">
                                            <PunchClock />
                                        </InputAdornment>
                                    ),
                                },
                                
                            }}
                        /></div>
                        </Stack>
                    </Box>
                </Modal>
                
            </div>
    </>
}