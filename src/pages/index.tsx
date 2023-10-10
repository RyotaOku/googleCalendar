import { useState, useEffect, useRef } from 'react';
import moment, { Moment } from 'moment';
import Style from '@/styles/calendar.module.css'
import dayjs from 'dayjs';
import ja from 'dayjs/locale/ja';
dayjs.locale(ja);

// 画面の高さとって、ボックスのサイズと下の位置とって、調節

type ModalProps = {
  IsShowModal: boolean,
  IsShowUpdate: boolean,
  IsShowDelete: boolean,
  leftOffset: number,
  topOffset: number
}

type scheduleDetail = {
  id: number,
  schedule: string,
  memo: string,
  startDay: string,
  endDay: string,
  color: string
}

type SearchModal = {
  IsShowSearchModal: boolean,
}

type SearchState = {
  searchText: string,
  searchList: Array<scheduleDetail>
}

type ScheduleProps = {
  id: number,
  schedule: string,
  memo: string,
  startDay: string,
  endDay: string,
  color: string,
  list: Array<scheduleDetail>
}

type sideMenu = {
  IsShowSideMenu: boolean
}

type DragState = {
  grabFlag: boolean,
  x: number,
  y: number,
  prevX: number,
  prevY: number
}

async function BrunchScheduleModal(schedule: ScheduleProps, setSchedule: Function, modal: ModalProps, setModal: Function, e: any, date: any, d: any) {
  if (e === null && date === null && d === null) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const formattedDate = `${currentYear.toString().padStart(4, '0')}-${currentMonth.toString().padStart(2, '0')}`;
    setSchedule({
      ...schedule,
      schedule: '',
      memo: '',
      startDay: formattedDate + '-01',
      endDay: formattedDate + '-01'
    })

    setModal({
      ...modal,
      IsShowModal: true,
      leftOffset: 210,
      topOffset: 100
    })

  } else {
    if (e.target instanceof HTMLTableCellElement || e.target instanceof HTMLSpanElement || e.target instanceof HTMLParagraphElement) {
      setSchedule({
        ...schedule,
        schedule: '',
        memo: '',
        startDay: date.format('YYYY-MM-' + d.toString().padStart(2, '0')),
        endDay: date.format('YYYY-MM-' + d.toString().padStart(2, '0'))
      })
      if (e.currentTarget.getBoundingClientRect().top + 600 > window.innerHeight && e.currentTarget.offsetLeft < 150) {
        setModal({
          ...modal,
          IsShowModal: true,
          leftOffset: e.currentTarget.offsetLeft + 595,
          topOffset: e.currentTarget.getBoundingClientRect().top - (e.currentTarget.getBoundingClientRect().top + 670 - window.innerHeight)
        })

      } else if (e.currentTarget.getBoundingClientRect().top + 600 > window.innerHeight) {
        setModal({
          ...modal,
          IsShowModal: true,
          leftOffset: e.currentTarget.offsetLeft,
          topOffset: e.currentTarget.getBoundingClientRect().top - (e.currentTarget.getBoundingClientRect().top + 670 - window.innerHeight)
        })
      } else if (e.currentTarget.offsetLeft < 150) {
        setModal({
          ...modal,
          IsShowModal: true,
          leftOffset: e.currentTarget.offsetLeft + 595,
          topOffset: e.currentTarget.getBoundingClientRect().top - 60
        })
      } else {
        setModal({
          ...modal,
          IsShowModal: true,
          leftOffset: e.currentTarget.offsetLeft,
          topOffset: e.currentTarget.getBoundingClientRect().top - 60
        })
      }
    } else {
      const result = await show(schedule, setSchedule, null, null, null)
      const scheduleItem = result.find((item: any) => item.id === e.target.id);

      setSchedule({
        ...schedule,
        id: e.target.id,
        schedule: scheduleItem.schedule,
        memo: scheduleItem.memo,
        startDay: scheduleItem.startDay,
        endDay: scheduleItem.endDay,
        color: scheduleItem.color
      })
      if (e.target.getBoundingClientRect().top + 600 > window.innerHeight && e.target.parentElement.offsetLeft < 150) {


        setModal({
          ...modal,
          IsShowModal: true,
          IsShowUpdate: true,
          IsShowDelete: true,
          leftOffset: e.target.parentElement.offsetLeft + 595,
          topOffset: e.target.getBoundingClientRect().top - (e.target.getBoundingClientRect().top + 670 - window.innerHeight)
        })

      } else if (e.target.getBoundingClientRect().top + 600 > window.innerHeight) {
        setModal({
          ...modal,
          IsShowModal: true,
          IsShowUpdate: true,
          IsShowDelete: true,
          leftOffset: e.target.parentElement.offsetLeft,
          topOffset: e.target.getBoundingClientRect().top - (e.target.getBoundingClientRect().top + 670 - window.innerHeight)
        })
      } else if (e.target.parentElement.offsetLeft < 150) {
        setModal({
          ...modal,
          IsShowModal: true,
          IsShowUpdate: true,
          IsShowDelete: true,
          leftOffset: e.target.parentElement.offsetLeft + 595,
          topOffset: e.target.getBoundingClientRect().top - 60
        })
      } else {
        setModal({
          ...modal,
          IsShowModal: true,
          IsShowUpdate: true,
          IsShowDelete: true,
          leftOffset: e.target.parentElement.offsetLeft,
          topOffset: e.target.getBoundingClientRect().top - 60
        })
      }
    }
  }
}

async function save(schedule: ScheduleProps, setSchedule: Function) {
  const res = await fetch('/api/calendar/add-schedule', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'pragma': 'no-cache',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify(schedule)
  })
  const result = await res.json()
  show(schedule, setSchedule, null, null, null)
}

async function search(searchText: SearchState, setSearchText: Function) {
  const res = await fetch('/api/calendar/search-schedule', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'pragma': 'no-cache',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify(searchText)
  })
  const result = await res.json()
  setSearchText({
    ...searchText,
    searchList: result.list
  })
  alert(`${result.list.length}件の結果が見つかりました。`)
  return result.list;

}

async function show(schedule: ScheduleProps, setSchedule: Function, e: any, date: any, d: any) {
  const res = await fetch('/api/calendar/show-schedule', {
    method: 'POST',
    headers: {
      'pragma': 'no-cache',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify(schedule)
  })
  const result = await res.json()
  if (e == null && date == null && d == null) {
    setSchedule({
      ...schedule,
      list: result.list
    })
  } else {
    setSchedule({
      ...schedule,
      schedule: result.list.schedule,
      memo: result.list.memo,
      startDay: date.format('YYYY-MM-' + d.toString().padStart(2, '0')),
      endDay: date.format('YYYY-MM-' + d.toString().padStart(2, '0')),
      list: result.list,
      color: result.list.color
    })
  }
  return result.list;
}

async function editSchedule(schedule: ScheduleProps, setSchedule: Function) {
  const res = await fetch('/api/calendar/edit-schedule', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify(schedule)
  })

  if (res.status !== 200) {
    throw new Error()
  }
  show(schedule, setSchedule, null, null, null)
}

async function delSchedule(schedule: ScheduleProps, setSchedule: Function) {
  const res = await fetch('/api/calendar/del-schedule', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify(schedule)
  })

  if (res.status !== 200) {
    throw new Error()
  }
  show(schedule, setSchedule, null, null, null)
}

export default function CalendarForm() {
  const [modal, setModal] = useState<ModalProps>({
    IsShowModal: false,
    IsShowUpdate: false,
    IsShowDelete: false,
    leftOffset: 0,
    topOffset: 0
  });

  const [searchModal, setSearchModal] = useState<SearchModal>({
    IsShowSearchModal: false
  })

  const [searchText, setSearchText] = useState<SearchState>({
    searchText: '',
    searchList: [] as Array<ScheduleProps>
  })

  const [schedule, setSchedule] = useState<ScheduleProps>({
    id: 0,
    schedule: '',
    memo: '',
    startDay: '',
    endDay: '',
    color: '',
    list: [] as Array<scheduleDetail>
  })

  const [side, setSide] = useState<sideMenu>({
    IsShowSideMenu: true
  })

  const [date, setDate] = useState<Moment>(moment());

  const [drag, setDrag] = useState<DragState>({
    //false: つかんでない。 true:つかんでる
    grabFlag: false,
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (drag.grabFlag) { // drag.grabFlag === trueの省略形
        // マウスの移動量を算出（前回のマウス位置より）
        const diffX = e.clientX - drag.prevX
        const diffY = e.clientY - drag.prevY

        // マウスの移動量をBoxのx/yに加算
        setDrag({
          ...drag,
          x: drag.x + diffX,
          y: drag.y + diffY,
          prevX: e.clientX,
          prevY: e.clientY
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [drag])

  const scheduleFormRef = useRef<HTMLInputElement>(null);

  const wrapStyle = {
    top: modal.topOffset + 50 + drag.y,
    left: modal.leftOffset - 195 + drag.x,
  } as React.CSSProperties

  const modalStyle = {
    position: 'absolute',
    top: modal.topOffset,
    left: modal.leftOffset,
  } as React.CSSProperties

  const prevMonth = () => {
    setDate((prev: Moment) => prev.clone().subtract(1, 'month'));
  };

  const nextMonth = () => {
    setDate((prev: Moment) => prev.clone().add(1, 'month'));
  };

  const currentMonth = () => {
    setDate(moment());
  };

  const weekdaysShort: string[] = ['日', '月', '火', '水', '木', '金', '土'];

  const firstDayOfMonth = () => {
    let dateObject: Moment = date;
    let firstDay: string = moment(dateObject).startOf('month').format('d');
    return parseInt(firstDay, 10);
  };

  const daysInMonth = () => {
    return date.daysInMonth();
  };

  const renderCalendar = () => {
    let blanks: JSX.Element[] = [];
    for (let i = 0; i < firstDayOfMonth(); i++) {
      blanks.push(<td key={i * 80} className="calendar-day empty">{""}</td>);
    }

    let daysInMonthArr: JSX.Element[] = [];
    for (let d = 1; d <= daysInMonth(); d++) {
      const today = moment().date() === d && date.month() === moment().month() && date.year() === moment().year();
      const className = `${Style['calendar-day']} ${today ? Style['today'] : ''}`;
      const targetDate = moment(date).date(d);
      const targetSchedule = schedule.list && schedule.list.filter(row => {
        const rowDate = moment(row.startDay);
        return rowDate.year() === targetDate.year() && rowDate.month() === targetDate.month() && rowDate.date() === targetDate.date();
      });
      daysInMonthArr.push(
        <td key={d} className={className} onClick={(e) => {
          BrunchScheduleModal(schedule, setSchedule, modal, setModal, e, date, d);
          // show(schedule, setSchedule, e, date, d)
        }}
        >
          <p className={Style.wrap}><span>{d}</span></p>
          {targetSchedule && targetSchedule.map((row) => {
            return <div key={row.id} id={row.id.toString()} style={{ 'background': schedule.list.find((item: any) => item.id === row.id)?.color }}>{row.schedule}</div>
          })}
        </td >
      );
    }


    let totalSlots: JSX.Element[] = [...blanks, ...daysInMonthArr];
    let rows: JSX.Element[] = [];
    let cells: JSX.Element[] = [];

    totalSlots.forEach((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row);
      } else {
        // 最後の行が7つ未満の場合、空のtd要素を追加する
        while (cells.length < 7) {
          cells.push(<td key={`empty-${cells.length}`} className="calendar-day empty">{""}</td>);
        }

        // 最後の行をrowsに追加
        rows.push(<tr key={`row-${i / 7}`}>{cells}</tr>);

        cells = [];
        cells.push(row);
      }
      if (i === totalSlots.length - 1) {
        // 最後の行が7つ未満の場合、空のtd要素を追加する
        while (cells.length < 7) {
          cells.push(<td key={`empty-${cells.length}`} className="calendar-day empty">{""}</td>);
        }

        // 最後の行をrowsに追加
        rows.push(<tr key={i + 1}>{cells}</tr>);
      }
    });

    return <tbody>{rows}</tbody>;

  };

  useEffect(() => {
    show(schedule, setSchedule, null, null, null)
  }, [])
  const color = {
    'background': schedule.color ? schedule.color : '#be0000'
  }

  return (
    <>
      <div className={Style.header}>
        <button className={Style.menu} onClick={() => {
          if (side.IsShowSideMenu) {
            setSide({
              ...side,
              IsShowSideMenu: false
            })
          } else {
            setSide({
              ...side,
              IsShowSideMenu: true
            })
          }

        }}></button>
        <h1 className={Style.logo}>カレンダー</h1>
        <h2 className={Style.calendarData}>{date.format("YYYY" + "年" + " " + "M" + "月")}</h2>

        <button className={Style.todayButton} onClick={() => {
          currentMonth()
        }}>今日<span className={Style.todayTooltip}>{dayjs().format("M" + "月" + " " + "D" + "日" + " " + "(" + "dddd" + ")").toString()}</span></button>


        <button className={Style.headerPrev} onClick={() => {
          prevMonth()
        }
        }></button>
        <button className={Style.headerNext} onClick={() => {
          nextMonth()
        }
        }></button>
        <button className={Style.xp}
          onClick={() => {
            alert('実装したかったものの残骸です...泣')
          }}></button>
      </div>
      <div className={Style.mainForm}>
        <div className={Style.leftForm} style={{ 'display': side.IsShowSideMenu ? 'block' : 'none' }}>
          <button className={Style.createButton}
            onClick={(e) => {
              BrunchScheduleModal(schedule, setSchedule, modal, setModal, null, null, null)
            }}>
            <span>作成</span>
            <svg width="36" height="36" viewBox="0 0 36 36">
              <path fill="#34A853" d="M16 16v14h4V20z"></path>
              <path fill="#4285F4" d="M30 16H20l-4 4h14z"></path>
              <path fill="#FBBC05" d="M6 16v4h10l4-4z"></path>
              <path fill="#EA4335" d="M20 16V6h-4v14z"></path>
              <path fill="none" d="M0 0h36v36H0z"></path>
            </svg>
          </button>
          <button className={Style.leftPrev} onClick={() => {
            prevMonth()
          }
          }></button>
          <button className={Style.leftNext} onClick={() => {
            nextMonth()
          }
          }></button>
          <table className={Style.leftCalendar}>
            <caption className={Style.calendarCaption}>{date.format("YYYY" + "年" + " " + "M" + "月")}</caption>
            <thead>
              <tr>
                {weekdaysShort.map((day) => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            {renderCalendar()}
          </table>
          <input type="checkbox" className={Style.darkMode} onChange={() => {

          }} />
        </div>
        <div className={Style.centerForm}>
          <table className={Style.mainCalendar}>
            <thead>
              <tr>
                {weekdaysShort.map((day) => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            {renderCalendar()}
          </table>
        </div>
        <div className={Style.rightForm}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/KPRF_Logo.svg/1920px-KPRF_Logo.svg.png" alt="" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Coat_of_arms_of_East_Germany.svg/1920px-Coat_of_arms_of_East_Germany.svg.png" alt="" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Logo_of_the_Fourth_International.svg/1920px-Logo_of_the_Fourth_International.svg.png" alt="" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Red_star.svg/1920px-Red_star.svg.png" alt="" />
          <img src="https://www.freeiconspng.com/thumbs/search-icon-png/search-icon-png-2.png" alt="" onClick={() => {
            setSearchModal({
              ...searchModal,
              IsShowSearchModal: true
            })
          }} />
        </div>
      </div>

      {
        searchModal.IsShowSearchModal &&
        <>
          <div className={Style.overlayBlack} onClick={() => {
            setSearchModal({
              ...searchModal,
              IsShowSearchModal: false,
            })
          }}></div>
          <div className={Style.searchWrap}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Danghui_golden_%28pre-1996%29.svg/1200px-Danghui_golden_%28pre-1996%29.svg.png" alt="" />
            <div className={Style.searchInner}>
              <input type="text" value={searchText.searchText} className={Style.searchInput} placeholder='検索する文字列を入力' onChange={(e) => {
                setSearchText({
                  ...searchText,
                  searchText: e.target.value
                })
              }} />
              <button className={Style.searchButton} onClick={() => {
                if (searchText.searchText !== '') {
                  search(searchText, setSearchText)
                } else {
                  alert('おいおい、何も文字列がないじゃないか。冷やかしなら帰ってくれ。')
                }
                // setSearchText({
                //   ...searchText,
                //   searchText: ''
                // })

              }}></button>
              <div className={Style.resultScroll}>

                {searchText.searchList.map((v) =>
                  <div className={Style.resultWrap} key={v.id}>
                    <div className={Style.resultColorPreview} style={{ 'background': v.color }}></div>
                    <p className={Style.resultDay}>{v.startDay.replace(/-/g, '/')} - {v.endDay.replace(/-/g, '/')}</p>
                    <p className={Style.resultSchedule}>{v.schedule} <span>{v.memo}</span></p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      }
      {
        modal.IsShowModal &&
        <>
          <div className={Style.overlay} onClick={() => {
            setModal({
              ...modal,
              IsShowModal: false,
              IsShowDelete: false,
              IsShowUpdate: false
            })
            setDrag({
              ...drag,
              grabFlag: false,
              x: 0,
              y: 0,
              prevX: 0,
              prevY: 0
            })
            setSchedule({
              ...schedule,
              schedule: '',
              memo: '',
              startDay: '',
              endDay: ''
            })
          }}></div>
          <div style={{ ...modalStyle, ...wrapStyle }} className={Style.modalWrap}
            onMouseDown={(e) => {
              if (e.clientX >= e.currentTarget.getBoundingClientRect().left &&
                e.clientX <= e.currentTarget.getBoundingClientRect().right &&
                e.clientY >= e.currentTarget.getBoundingClientRect().top &&
                e.clientY <= e.currentTarget.getBoundingClientRect().top + 40) {
                setDrag({
                  ...drag,
                  grabFlag: true,
                  prevX: e.clientX,
                  prevY: e.clientY,
                })
              }
            }}
            onMouseUp={() => setDrag({
              ...drag,
              grabFlag: false
            })}>
            <div className={Style.scheduleFormWrap}>
              <input type="text" className={Style.scheduleForm} autoFocus placeholder='タイトル・予定を追加' value={schedule.schedule} onChange={(e) => {
                setSchedule({
                  ...schedule,
                  schedule: e.target.value
                })
              }}
                ref={scheduleFormRef}
              />
              <div className={Style.scheduleUnderLine}></div>
            </div>
            <button className={Style.modalOff} onClick={() => {
              setModal({
                ...modal,
                IsShowModal: false
              })
              setDrag({
                ...drag,
                grabFlag: false,
                x: 0,
                y: 0,
                prevX: 0,
                prevY: 0
              })
              setSchedule({
                ...schedule,
                schedule: '',
                memo: '',
                startDay: '',
                endDay: ''
              })
            }}></button>

            <div className={Style.dayWrap}>
              <input type="date" className={Style.day}
                value={schedule.startDay} onChange={(e) => {
                  setSchedule({
                    ...schedule,
                    startDay: e.target.value
                  })
                }} />
              <input type="date" className={Style.day}
                value={schedule.endDay} onChange={(e) => {
                  setSchedule({
                    ...schedule,
                    endDay: e.target.value
                  })
                }} />
            </div>
            <div className={Style.memoWrap}>
              <input type="text" className={Style.memoForm} value={schedule.memo} placeholder="メモを追加" onChange={(e) => {
                setSchedule({
                  ...schedule,
                  memo: e.target.value
                })
              }} />
            </div>
            <div className={Style.colorWrap}>

              <div>
                <div className={Style.colorPreview} style={color}></div><span>色を選択</span>
              </div>

              <div className={Style.selectColor}>
                <label htmlFor={Style.communismRed}>
                  <input type="radio" id={Style.communismRed} name="color"
                    onChange={() => {
                      setSchedule({
                        ...schedule,
                        color: '#be0000'
                      })
                    }} />
                  <span>Communism Red</span>
                </label>

                <label htmlFor={Style.flamingo}>
                  <input type="radio" id={Style.flamingo} name="color"
                    onChange={() => {
                      setSchedule({
                        ...schedule,
                        color: '#e67c73'
                      })
                    }} />
                  <span>Flamingo</span>
                </label>

                <label htmlFor={Style.banana}>
                  <input type="radio" id={Style.banana} name="color"
                    onChange={() => {
                      setSchedule({
                        ...schedule,
                        color: '#ffd700'
                      })
                    }} />
                  <span>Communism Yellow</span>
                </label>

                <label htmlFor={Style.green}>
                  <input type="radio" id={Style.green} name="color"
                    onChange={() => {
                      setSchedule({
                        ...schedule,
                        color: '#0b8043'
                      })
                    }} />
                  <span>Colony Green</span>
                </label>

                <label htmlFor={Style.skyblue}>
                  <input type="radio" id={Style.skyblue} name="color"
                    onChange={() => {
                      setSchedule({
                        ...schedule,
                        color: '#9CB2F1'
                      })
                    }} />
                  <span>Western Blue</span>
                </label>

                <label htmlFor={Style.blue}>
                  <input type="radio" id={Style.blue} name="color"
                    onChange={() => {
                      setSchedule({
                        ...schedule,
                        color: '#0000A9'
                      })
                    }} />
                  <span>Capitalism Blue</span>
                </label>

                <label htmlFor={Style.grape}>
                  <input type="radio" id={Style.grape} name="color"
                    onChange={() => {
                      setSchedule({
                        ...schedule,
                        color: '#8121ee'
                      })
                    }} />
                  <span>Non-aligned Grape</span>
                </label>

                <label htmlFor={Style.gray}>
                  <input type="radio" id={Style.gray} name="color"
                    onChange={() => {
                      setSchedule({
                        ...schedule,
                        color: '#5e5e5e'
                      })
                    }} />
                  <span>Another Countries</span>
                </label>
              </div>
            </div>
            {modal.IsShowDelete && <button className={Style.delButton} onClick={() => {
              let deleteConfirmation = window.confirm('この予定を削除してもよろしいですか?')
              if (deleteConfirmation) {
                delSchedule(schedule, setSchedule)
                setModal({
                  ...modal,
                  IsShowModal: false,
                  IsShowDelete: false,
                  IsShowUpdate: false
                })
              }
            }}>削除</button>}
            {modal.IsShowDelete && <button className={Style.saveButton} onClick={() => {
              if (schedule.schedule === '') {
                alert('タイトルが空です。')
                if (scheduleFormRef.current !== null) {
                  scheduleFormRef.current.focus();
                }
              } else if (schedule.startDay === '' || schedule.endDay === '') {
                alert('日付が空です。')
              } else if (new Date(schedule.startDay) > new Date(schedule.endDay)) {
                alert('終了日時が開始日時よりも前の日付になっています。');
              } else {
                let deleteConfirmation = window.confirm(`以下の内容で更新します。
Title : ${schedule.schedule}
Memo : ${schedule.memo}
予定日時 : ${schedule.startDay} - ${schedule.endDay}
color : ${schedule.color}`)
                if (deleteConfirmation) {
                  editSchedule(schedule, setSchedule)
                  setModal({
                    ...modal,
                    IsShowModal: false,
                    IsShowDelete: false,
                    IsShowUpdate: false
                  })
                }
              }
            }}>更新</button>}
            {!modal.IsShowDelete && <button className={Style.saveButton} onClick={() => {
              if (schedule.schedule === '') {
                alert('タイトルが空です。')
                if (scheduleFormRef.current !== null) {
                  scheduleFormRef.current.focus();
                }
              } else if (schedule.startDay === '' || schedule.endDay === '') {
                alert('日付が空です。')
              } else if (new Date(schedule.startDay) > new Date(schedule.endDay)) {
                alert('終了日時が開始日時よりも前の日付になっています。');
              } else {
                save(schedule, setSchedule)
                setSchedule({
                  ...schedule,
                  schedule: '',
                  memo: '',
                  startDay: '',
                  endDay: ''
                })
                setModal({
                  ...modal,
                  IsShowModal: false
                })
              }
            }}>保存</button>}
          </div>
        </>
      }
    </>
  )
}