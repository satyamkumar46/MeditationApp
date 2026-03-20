import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Fontisto from "react-native-vector-icons/Fontisto";
import Ionicons from "react-native-vector-icons/Ionicons";

// Base design dimensions (iPhone 14 Pro)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

// Responsive scaling helpers
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const scale = (size) => (SCREEN_WIDTH / BASE_WIDTH) * size;
const verticalScale = (size) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const ExploreScreen = () => {
  return (
    <View style={styles.container}>
      {/* header section */}
      <View style={styles.headerContainer}>
        {/* header text */}
        <View style={styles.headerTextContainer}>
          <View style={styles.headerTextContainerSecond}>
            <Text style={styles.headerText}>Explore</Text>
          </View>

          {/* bell-icon */}
          <View style={styles.headerBellIconContainer}>
            <Fontisto name="bell" color="#94A3B8" size={24} />
          </View>
        </View>

        {/* search bar */}
        <View style={styles.searchBarContainer}>
          {/* icon */}
          <View style={styles.searchIconContainer}>
            <Ionicons name="search-sharp" color="#94A3B8" size={24} />
          </View>
          <TextInput
            placeholder="Search meditations, music, teachers"
            style={styles.searchPlaceholder}
            placeholderTextColor={"#20DF6066"}
          />
        </View>
      </View>

      {/* content section */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.contentSection}
      >
        {/* collection search */}
        <View style={styles.collectionSearchContainer}>
          {/* popular collection */}
          <View style={styles.popularCategoryContainer}>
            <View style={styles.popularCategoryTextContainer}>
              <Text style={styles.popularCategoryText}>
                Popular Collections
              </Text>
            </View>
            <View style={styles.popularCategorySeeTextContainer}>
              <Text style={styles.popularCategorySeeText}>See all</Text>
            </View>
          </View>

          {/* card */}
          <View style={styles.cardContainer}>
            <View style={styles.cardOneContainer}>
              <Image
                source={require("../../assest/images/nature-sounds.avif")}
                style={styles.ContainerImage}
              />
              <View style={styles.cardOverlay} />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardText}>Nature Sounds</Text>
              </View>
            </View>

            <View style={styles.cardOneContainer}>
              <Image
                source={require("../../assest/images/stress.avif")}
                style={styles.ContainerImage}
              />
              <View style={styles.cardOverlay} />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardText}>Stress Relief</Text>
              </View>
            </View>
          </View>

          {/* top teachers */}
          <View style={styles.topTeachersContainer}>
            {/* teacher heading */}
            <View style={styles.teacherHeaderContainer}>
              <View style={styles.topTeachersTextContainer}>
                <Text style={styles.topTeachersText}>Top Teachers</Text>
              </View>

              <View style={styles.teacherViewAllContainer}>
                <Text style={styles.teacherViewAllText}>View all</Text>
              </View>
            </View>

            {/* teachers */}
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              style={styles.teachersContainer}
            >
              <View style={styles.firstFrame}>
                <View style={styles.firstCircle}>
                  <View style={styles.secondCircle}>
                    <Image
                      source={require("../../assest/images/first-Teacher-Img.png")}
                      style={styles.firstTeacherImage}
                    />
                  </View>
                </View>

                <View style={styles.teacherNameContainer}>
                  <Text style={styles.teacherName}>Elena Joy</Text>
                </View>
              </View>

              {/* second teacher */}
              <View style={styles.firstFrame}>
                <View style={styles.secondCircleOther}>
                  <Image
                    source={require("../../assest/images/Second-Teacher-Img.png")}
                    style={styles.otherTeacherImage}
                  />
                </View>

                <View style={styles.othersteacherNameContainer}>
                  <Text style={styles.teacherName}>Marcus T.</Text>
                </View>
              </View>

              {/* third teacher */}
              <View style={styles.firstFrame}>
                <View style={styles.secondCircleOther}>
                  <Image
                    source={require("../../assest/images/third-teacher-image.png")}
                    style={styles.otherTeacherImage}
                  />
                </View>

                <View style={styles.othersteacherNameContainer}>
                  <Text style={styles.teacherName}>Sarah K.</Text>
                </View>
              </View>

              {/* fourth teacher */}
              <View style={styles.firstFrame}>
                <View style={styles.secondCircleOther}>
                  <Image
                    source={require("../../assest/images/fourth-teacher-img.png")}
                    style={styles.otherTeacherImage}
                  />
                </View>

                <View style={styles.othersteacherNameContainer}>
                  <Text style={styles.teacherName}>Dr. David</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>

        {/* new arrival */}
        <View style={styles.newArrivalContainer}>
          {/* text */}
          <View style={styles.newArrivalTextContainer}>
            <Text style={styles.newArrivalText}>New Arrival</Text>
          </View>

          {/* song-1 */}
          <View style={styles.songContainer}>
            <View style={styles.songInsideContainer}>
              {/* image */}
              <View style={styles.songInsideSecondContainer}>
                <View style={styles.songOneImgContainer}>
                  <Image
                    source={require("../../assest/images/song-1-img.png")}
                    style={styles.songOneImg}
                  />
                </View>

                {/* text */}
                <View style={styles.arrivalInsideTextContainer}>
                  <View style={styles.mindMorningContainer}>
                    <Text style={styles.mindMorningText}>Mindful Mornings</Text>
                  </View>

                  <View style={styles.timerContainer}>
                    <Text style={styles.time}>12 min</Text>
                    <View style={styles.activebtn}></View>
                    <Text style={styles.guide}>Guided</Text>
                  </View>
                </View>

                {/* play btn */}
                <View style={styles.songPlayBtnContainer}>
                  <View style={styles.songCirclePtrn}>
                    <Feather name="play" color="#20DF60" size={24} />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* song -2  */}

          <View style={styles.songContainer}>
            <View style={styles.songInsideContainer}>
              {/* image */}
              <View style={styles.songInsideSecondContainer}>
                <View style={styles.songOneImgContainer}>
                  <Image
                    source={require("../../assest/images/song-2-img.png")}
                    style={styles.songOneImg}
                  />
                </View>

                {/* text */}
                <View style={styles.arrivalInsideTextContainer}>
                  <View style={styles.mindMorningContainer}>
                    <Text style={styles.mindMorningText}>
                      Deep Sleep Voyage
                    </Text>
                  </View>

                  <View style={styles.timerContainer}>
                    <Text style={styles.time}>45 min</Text>
                    <View style={styles.activebtn}></View>
                    <Text style={styles.guide}>Ambient</Text>
                  </View>
                </View>

                {/* play btn */}
                <View style={styles.songPlayBtnContainer}>
                  <View style={styles.songCirclePtrn}>
                    <Feather name="play" color="#20DF60" size={24} />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* song-3 */}
          <View style={styles.songContainer}>
            <View style={styles.songInsideContainer}>
              {/* image */}
              <View style={styles.songInsideSecondContainer}>
                <View style={styles.songOneImgContainer}>
                  <Image
                    source={require("../../assest/images/song-3-img.png")}
                    style={styles.songOneImg}
                  />
                </View>

                {/* text */}
                <View style={styles.arrivalInsideTextContainer}>
                  <View style={styles.mindMorningContainer}>
                    <Text style={styles.mindMorningText}>
                      Anxiety Relief Beta
                    </Text>
                  </View>

                  <View style={styles.timerContainer}>
                    <Text style={styles.time}>12 min</Text>
                    <View style={styles.activebtn}></View>
                    <Text style={styles.guide}>Binaural</Text>
                  </View>
                </View>

                {/* play btn */}
                <View style={styles.songPlayBtnContainer}>
                  <TouchableOpacity style={styles.songCirclePtrn}>
                    <Feather name="play" color="#20DF60" size={24} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#112116",
  },
  headerContainer: {
    marginTop: verticalScale(35),
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(10),
  },
  headerTextContainer: {
    marginHorizontal: scale(16),
    flexDirection: "row",
    justifyContent: "space-between",
    height: verticalScale(40),
  },
  headerTextContainerSecond: {
    width: scale(110),
    justifyContent: "center",
  },
  headerText: {
    fontSize: moderateScale(27),
    fontWeight: "bold",
    color: "#F1F5F9",
  },
  headerBellIconContainer: {
    width: scale(35),
    alignItems: "center",
    justifyContent: "center",
  },
  searchBarContainer: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(15),
    height: verticalScale(40),
    backgroundColor: "#20DF601A",
    borderRadius: moderateScale(12),
    flexDirection: "row",
  },
  searchIconContainer: {
    width: scale(35),
    justifyContent: "center",
    marginLeft: scale(10),
  },
  searchPlaceholder: {
    fontSize: moderateScale(14),
  },
  contentSection: {
    height: verticalScale(800),
  },
  popularCategoryContainer: {
    marginTop: verticalScale(15),
    flexDirection: "row",
    marginHorizontal: scale(16),
    height: verticalScale(50),
    alignItems: "center",
    justifyContent: "space-between",
  },
  popularCategoryTextContainer: {
    width: scale(250),
    height: verticalScale(40),
    justifyContent: "center",
  },
  popularCategoryText: {
    color: "#F1F5F9",
    fontSize: moderateScale(22),
    fontWeight: "bold",
  },
  popularCategorySeeTextContainer: {
    height: verticalScale(40),
    paddingLeft: scale(20),
    justifyContent: "center",
  },
  popularCategorySeeText: {
    color: "#20DF60",
    fontSize: moderateScale(15),
    fontWeight: "medium",
  },
  cardContainer: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(15),
    height: verticalScale(115),
    flexDirection: "row",
    gap: moderateScale(15),
  },
  cardOneContainer: {
    height: verticalScale(115),
    width: scale(170),
    borderRadius: moderateScale(12),
    overflow: "hidden",
  },
  ContainerImage: {
    width: scale(170),
    height: verticalScale(115),
    resizeMode: "cover",
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    borderRadius: moderateScale(12),
  },
  cardTextContainer: {
    position: "absolute",
    bottom: moderateScale(10),
    left: moderateScale(12),
    right: moderateScale(12),
  },
  cardText: {
    color: "#F1F5F9",
    fontSize: moderateScale(15),
    fontWeight: "bold",
  },
  topTeachersContainer: {
    marginTop: verticalScale(30),
    marginHorizontal: scale(16),
    height: verticalScale(200),
  },
  teacherHeaderContainer: {
    flexDirection: "row",
    height: verticalScale(35),
    justifyContent: "space-between",
  },
  topTeachersTextContainer: {
    width: scale(150),
    justifyContent: "center",
  },
  topTeachersText: {
    color: "#F1F5F9",
    fontWeight: "bold",
    fontSize: moderateScale(22),
  },
  teacherViewAllContainer: {
    justifyContent: "center",
    paddingLeft: scale(10),
  },
  teacherViewAllText: {
    color: "#20DF60",
    fontSize: moderateScale(15),
    fontWeight: "medium",
  },
  teachersContainer: {
    height: verticalScale(113),
    marginHorizontal: scale(-16),
    marginTop: verticalScale(10),
  },
  firstFrame: {
    height: verticalScale(113),
    width: scale(100),
    marginHorizontal: scale(15),
  },
  firstCircle: {
    borderWidth: 3,
    height: verticalScale(100),
    width: scale(100),
    borderColor: "#20DF60",
    borderRadius: moderateScale(55),
  },
  secondCircle: {
    height: verticalScale(95),
    justifyContent: "center",
    alignItems: "center",
  },
  firstTeacherImage: {
    height: verticalScale(85),
    width: scale(85),
  },
  teacherNameContainer: {
    marginTop: verticalScale(12),
    height: verticalScale(30),
    alignItems: "center",
  },
  teacherName: {
    fontSize: moderateScale(20),
    fontWeight: "medium",
    color: "#F1F5F9",
  },
  secondCircleOther: {
    height: verticalScale(95),
    justifyContent: "center",
    alignItems: "center",
  },
  otherTeacherImage: {
    height: verticalScale(100),
    width: scale(100),
  },
  othersteacherNameContainer: {
    marginTop: verticalScale(16),
    height: verticalScale(30),
    alignItems: "center",
  },
  newArrivalContainer: {
    marginTop: verticalScale(10),
    height: verticalScale(340),
  },
  newArrivalTextContainer: {
    height: verticalScale(35),
    marginHorizontal: scale(16),
    justifyContent: "center",
  },
  newArrivalText: {
    color: "#F1F5F9",
    fontWeight: "bold",
    fontSize: moderateScale(23),
  },
  songContainer: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(12),
    height: verticalScale(90),
    borderRadius: moderateScale(25),
    backgroundColor: "#20DF6033",
  },
  songInsideContainer: {
    marginTop: verticalScale(10),
    marginHorizontal: scale(16),
    height: verticalScale(70),
  },
  songOneImgContainer: {
    height: verticalScale(70),
    width: scale(70),
    overflow: "hidden",
    borderRadius: moderateScale(12),
  },
  songOneImg: {
    height: verticalScale(90),
    width: scale(90),
  },
  arrivalInsideTextContainer: {
    marginLeft: scale(10),
    justifyContent: "center",
    width: scale(150),
  },
  songInsideSecondContainer: {
    height: verticalScale(70),
    flexDirection: "row",
  },
  timerContainer: {
    flexDirection: "row",
    gap: moderateScale(8),
    alignItems: "center",
  },
  mindMorningContainer: {
    width: scale(170),
  },
  mindMorningText: {
    color: "#F1F5F9",
    fontWeight: "bold",
    fontSize: moderateScale(15),
  },
  activebtn: {
    backgroundColor: "#20DF6099",
    height: moderateScale(8),
    width: moderateScale(8),
    borderRadius: moderateScale(4),
  },
  time: {
    color: "#20DF6099",
  },
  guide: {
    color: "#20DF6099",
  },
  songPlayBtnContainer: {
    left: scale(35),
    width: scale(60),
    justifyContent: "center",
    alignItems: "center",
  },
  songCirclePtrn: {
    height: verticalScale(55),
    width: scale(55),
    backgroundColor: "#20DF6033",
    borderRadius: moderateScale(35),
    justifyContent: "center",
    alignItems: "center",
  },
});
