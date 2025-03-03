import { React, useContext, useState, useEffect } from "react";
import "./Classification.Component.css";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import AppContext from "../../Storage/AppContext";
import config from "../../config/config";

const Classification = (props) => {
  const context = useContext(AppContext);
  const [users, setUsers] = useState(props.room.users ?? props.room?.room?.users);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    props.updateRoomData && setTimeout(() => {
      if (
        context.x_token &&
        context.current_room != undefined &&
        context.current_room?.exit != true
      ) {
        props.updateRoomData(context.current_room?.current?.id);
        setAnimate(!animate);
      }
    }, 60000);
    if (context.current_room?.exit) {
      context.setCurrentRoom(() => ({
      
      }));
    }
  }, [context.current_room]);

  useEffect(() => {
    let users = props.room.users ?? props.room.room.users;
    let usersTemp = users.filter(
      (element) => element.countries.length == 5
    );
    usersTemp.map((user) => {
      let total = 0;
      user.countries.map((country) => {
        let winnerOption = props.room.users ? country.UserCountry?.winnerOption : user.winnerOption[0]?.countryId;
        if ((winnerOption===true || winnerOption === country.id) && country.position == 1) {
          total += parseInt(country.points + country.points * 0.1);
        } else {
          total += parseInt(country.points);
        }
      });
      user.total = total;
    });
    usersTemp.sort((a, b) => b.total - a.total);
    setUsers(usersTemp);
    setAnimate(props.animate);
  }, [context.current_room]);

  return (
    <>
      {users.map((user) => {
        if (user.countries.length == 5) {
          return (
            <div
              className={
                animate ? "user-card-wrapper animate" : "user-card-wrapper"
              }
              style={{
                animationDelay: `${users.indexOf(user) * 120}ms`,
              }}
              key={users.indexOf(user)}
            >
              <article
                style={{
                  backgroundColor: user.color,
                }}
                className="user-card"
              >
                <div className="user-card-data">
                  <div className="user-card-info">
                    <img
                      src={user.image !== '' ?  `${user.image}` :
                        `${config.defProfilePicUrl}${user.username}`}
                      alt="imagen de usuario"
                    />
                    <p
                      className={users.indexOf(user) == 0 ? "user-winner" : ""}
                    >
                      {users.indexOf(user) + 1}. {user.username}
                    </p>
                  </div>
                  <div className="user-card-countries">
                    {user.countries.map((country) => {
                      
                       let winnerOption = props.room.users ? country.UserCountry?.winnerOption : user.winnerOption[0]?.countryId;
                      return (
                        <div
                          key={user.countries.indexOf(country)}
                          className="country-wrapper"
                        >
                          <p
                            style={{
                              fontWeight:
                                (winnerOption===true || winnerOption === country.id)
                                  ? "bold"
                                  : "100",
                            }}
                          >
                            <span
                              className={`fi fi-${country.code} fis country-flag`}
                              style={{
                                outline:
                                  country.position == 1
                                    ? "2px solid var(--euro-gold)"
                                    : "none",
                              }}
                            ></span>
                            {(winnerOption===true || winnerOption === country.id)
                              ? parseInt(country.points + country.points * 0.1)
                              : country.points}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="user-card-total">
                  <p>{user.total}</p>
                </div>
              </article>
            </div>
          );
        }
      })}
    </>
  );
};

export default Classification;
